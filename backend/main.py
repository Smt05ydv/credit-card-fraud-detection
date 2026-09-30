from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, create_model
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import joblib
import os
import io
import json
from datetime import datetime
from database import init_db, insert_transaction, get_transactions, get_transaction_by_id

app = FastAPI(title="Credit Card Fraud Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")

models = {}
scaler = None
metrics_data = {}

def load_models():
    global models, scaler, metrics_data
    if os.path.exists(SCALER_PATH):
        scaler = joblib.load(SCALER_PATH)
    
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            metrics_data = json.load(f)

    # Load all models dynamically based on saved joblib files
    for filename in os.listdir(MODEL_DIR):
        if filename.endswith(".joblib") and filename != "scaler.joblib":
            model_name = filename.replace(".joblib", "").replace("_", " ").title()
            # Special case for SVM
            if model_name == "One Class Svm":
                model_name = "One Class SVM"
            models[model_name] = joblib.load(os.path.join(MODEL_DIR, filename))
            
    return len(models) > 0 and scaler is not None

# Pydantic schema for single prediction
fields = {"Time": (float, ...)}
for i in range(1, 29):
    fields[f"V{i}"] = (float, ...)
fields["Amount"] = (float, ...)

TransactionInput = create_model("TransactionInput", **fields)

def calculate_risk_score(anomaly_score: float, model_name: str) -> int:
    # anomaly_score scale depends on the model
    if model_name == "Isolation Forest":
        clipped_score = np.clip(anomaly_score, -0.3, 0.2)
        normalized = (0.2 - clipped_score) / 0.5
    elif model_name == "One Class SVM":
        # SVM decision function is often small, around -10 to +10
        clipped_score = np.clip(anomaly_score, -10.0, 10.0)
        normalized = (10.0 - clipped_score) / 20.0
    elif model_name == "Local Outlier Factor":
        # LOF returns negative outlier factors. Less than -1.5 is usually an anomaly
        clipped_score = np.clip(anomaly_score, -3.0, 1.0)
        normalized = (1.0 - clipped_score) / 4.0
    else:
        normalized = 0.5
        
    risk = int(normalized * 100)
    return int(np.clip(risk, 0, 100))

def get_risk_level(risk_score: int) -> str:
    if risk_score <= 39:
        return "Low Risk"
    elif risk_score <= 69:
        return "Medium Risk"
    else:
        return "High Risk"

def extract_anomaly_score(model, X, model_name):
    if hasattr(model, 'decision_function'):
        return float(model.decision_function(X)[0])
    elif hasattr(model, 'score_samples'):
        return float(model.score_samples(X)[0])
    return 0.0

def extract_batch_anomaly_scores(model, X, model_name):
    if hasattr(model, 'decision_function'):
        return model.decision_function(X)
    elif hasattr(model, 'score_samples'):
        return model.score_samples(X)
    return np.zeros(len(X))

@app.on_event("startup")
def startup_event():
    init_db()
    load_models()

@app.get("/api/health")
def health_check():
    loaded = load_models()
    return {"status": "ok", "models_loaded": loaded, "available_models": list(models.keys())}

@app.get("/api/models")
def get_available_models():
    if not models:
        load_models()
    return {"models": list(models.keys())}

@app.get("/api/model/metrics")
def get_model_metrics():
    if not metrics_data:
        load_models()
    return metrics_data

@app.post("/api/predict")
def predict(transaction: TransactionInput, model_name: str = Query("Isolation Forest")):
    if not load_models():
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    if model_name not in models:
        raise HTTPException(status_code=400, detail=f"Model '{model_name}' not available.")
        
    model = models[model_name]
    data_dict = transaction.model_dump() if hasattr(transaction, "model_dump") else transaction.dict()
    
    feature_names = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]
    features = [data_dict[col] for col in feature_names]
    
    X = np.array([features])
    X_scaled = scaler.transform(X)
    
    pred = model.predict(X_scaled)[0]
    is_anomaly = bool(pred == -1)
    anomaly_score = extract_anomaly_score(model, X_scaled, model_name)
    
    risk_score = calculate_risk_score(anomaly_score, model_name)
    risk_level = get_risk_level(risk_score)
    prediction_label = "Potential Fraud / Anomaly" if is_anomaly else "Normal"
    
    # Insert to DB
    amount = float(data_dict.get("Amount", 0))
    tx_id = insert_transaction(
        amount=amount, 
        model_used=model_name, 
        prediction=prediction_label, 
        anomaly_score=anomaly_score, 
        risk_score=risk_score, 
        risk_level=risk_level, 
        features=data_dict
    )
    
    return {
        "id": tx_id,
        "prediction": prediction_label,
        "is_anomaly": is_anomaly,
        "anomaly_score": round(anomaly_score, 4),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "model_used": model_name,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/predict/batch")
async def predict_batch(file: UploadFile = File(...), model_name: str = Query("Isolation Forest")):
    if not load_models():
        raise HTTPException(status_code=503, detail="Models not loaded")
    
    if model_name not in models:
        raise HTTPException(status_code=400, detail=f"Model '{model_name}' not available.")
        
    model = models[model_name]
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV file: {str(e)}")
        
    required_cols = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]
    missing_cols = [col for col in required_cols if col not in df.columns]
    
    if missing_cols:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing_cols}")
        
    df = df.dropna(subset=required_cols)
    X = df[required_cols]
    
    if X.empty:
        raise HTTPException(status_code=400, detail="No valid data in CSV")
        
    X_scaled = scaler.transform(X)
    preds = model.predict(X_scaled)
    scores = extract_batch_anomaly_scores(model, X_scaled, model_name)
    
    results = []
    normal_count = 0
    anomaly_count = 0
    high_risk_count = 0
    
    for i in range(len(preds)):
        is_anomaly = bool(preds[i] == -1)
        anomaly_score = float(scores[i])
        risk_score = calculate_risk_score(anomaly_score, model_name)
        risk_level = get_risk_level(risk_score)
        prediction_label = "Potential Fraud / Anomaly" if is_anomaly else "Normal"
        
        if is_anomaly:
            anomaly_count += 1
        else:
            normal_count += 1
            
        if risk_level == "High Risk":
            high_risk_count += 1
            
        results.append({
            "row_index": i + 1,
            "prediction": prediction_label,
            "is_anomaly": is_anomaly,
            "anomaly_score": round(anomaly_score, 4),
            "risk_score": risk_score,
            "risk_level": risk_level
        })
        
    return {
        "summary": {
            "total_rows": len(preds),
            "normal_count": normal_count,
            "anomaly_count": anomaly_count,
            "anomaly_percentage": round((anomaly_count / len(preds)) * 100, 2) if len(preds) > 0 else 0,
            "high_risk_count": high_risk_count,
            "model_used": model_name
        },
        "results": results
    }

@app.get("/api/transactions")
def get_tx_history(limit: int = 100, offset: int = 0, risk_filter: Optional[str] = None, prediction_filter: Optional[str] = None):
    transactions = get_transactions(limit=limit, offset=offset, risk_filter=risk_filter, prediction_filter=prediction_filter)
    return {"transactions": transactions}

@app.get("/api/transactions/{tx_id}")
def get_tx_details(tx_id: int):
    tx = get_transaction_by_id(tx_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    tx["features"] = json.loads(tx["features_json"])
    return tx

@app.get("/api/stats")
def get_stats():
    # Load actual stats from the database instead of mock data
    transactions = get_transactions(limit=10000) # Load a bunch to compute stats
    total = len(transactions)
    normal = sum(1 for t in transactions if t["prediction"] == "Normal")
    anomalies = total - normal
    high_risk = sum(1 for t in transactions if t["risk_level"] == "High Risk")
    
    return {
        "total_transactions": total,
        "normal_transactions": normal,
        "detected_anomalies": anomalies,
        "high_risk_transactions": high_risk,
        "anomaly_percentage": round((anomalies / total) * 100, 2) if total > 0 else 0.0,
        "recent_predictions": transactions[:5]
    }
