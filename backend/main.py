from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, create_model
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import joblib
import os
import io

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
MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")

model = None
scaler = None

def load_models():
    global model, scaler
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        return True
    return False

# Pydantic schema for single prediction
# We need Time, V1..V28, Amount
fields = {"Time": (float, ...)}
for i in range(1, 29):
    fields[f"V{i}"] = (float, ...)
fields["Amount"] = (float, ...)

TransactionInput = create_model("TransactionInput", **fields)

def calculate_risk_score(anomaly_score: float) -> int:
    # anomaly_score from Isolation Forest is usually between -0.5 and 0.5.
    # Lower (more negative) means more anomalous.
    # Let's map it to 0-100 where 100 is high risk.
    # Assume scores range mostly between -0.3 (anomaly) and 0.2 (normal)
    # Clip to expected bounds
    clipped_score = np.clip(anomaly_score, -0.3, 0.2)
    # Normalize to 0-1 (1 being most anomalous)
    normalized = (0.2 - clipped_score) / 0.5
    # Scale to 0-100
    risk = int(normalized * 100)
    return int(np.clip(risk, 0, 100))

def get_risk_level(risk_score: int) -> str:
    if risk_score <= 39:
        return "Low Risk"
    elif risk_score <= 69:
        return "Medium Risk"
    else:
        return "High Risk"

@app.on_event("startup")
def startup_event():
    load_models()

@app.get("/api/health")
def health_check():
    model_loaded = load_models()
    return {"status": "ok", "model_loaded": model_loaded}

@app.get("/api/model-info")
def model_info():
    if not load_models():
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {
        "model": "Isolation Forest",
        "parameters": {
            "n_estimators": model.n_estimators,
            "contamination": model.contamination
        }
    }

@app.post("/api/predict")
def predict(transaction: TransactionInput):
    if not load_models():
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    data_dict = transaction.dict()
    # Ensure correct order
    feature_names = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]
    features = [data_dict[col] for col in feature_names]
    
    X = np.array([features])
    X_scaled = scaler.transform(X)
    
    # Predict (-1 is anomaly, 1 is normal)
    pred = model.predict(X_scaled)[0]
    is_anomaly = bool(pred == -1)
    
    # Anomaly score
    anomaly_score = float(model.decision_function(X_scaled)[0])
    
    risk_score = calculate_risk_score(anomaly_score)
    risk_level = get_risk_level(risk_score)
    
    return {
        "prediction": "Potential Fraud / Anomaly" if is_anomaly else "Normal",
        "is_anomaly": is_anomaly,
        "anomaly_score": round(anomaly_score, 4),
        "risk_score": risk_score,
        "risk_level": risk_level
    }

@app.post("/api/predict/batch")
async def predict_batch(file: UploadFile = File(...)):
    if not load_models():
        raise HTTPException(status_code=503, detail="Model not loaded")
    
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
    scores = model.decision_function(X_scaled)
    
    results = []
    normal_count = 0
    anomaly_count = 0
    high_risk_count = 0
    
    for i in range(len(preds)):
        is_anomaly = bool(preds[i] == -1)
        anomaly_score = float(scores[i])
        risk_score = calculate_risk_score(anomaly_score)
        risk_level = get_risk_level(risk_score)
        
        if is_anomaly:
            anomaly_count += 1
        else:
            normal_count += 1
            
        if risk_level == "High Risk":
            high_risk_count += 1
            
        results.append({
            "row_index": i + 1,
            "prediction": "Potential Fraud / Anomaly" if is_anomaly else "Normal",
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
            "high_risk_count": high_risk_count
        },
        "results": results
    }

@app.get("/api/stats")
def get_stats():
    # In a real app, this would query a database of historical predictions
    # Here we'll return some mock aggregated stats based on the model training
    return {
        "total_transactions": 5000,
        "normal_transactions": 4950,
        "detected_anomalies": 50,
        "high_risk_transactions": 55,
        "anomaly_percentage": 1.0,
        "recent_predictions": [
            {"id": "TRX-101", "status": "Normal", "risk_score": 12},
            {"id": "TRX-102", "status": "Potential Fraud / Anomaly", "risk_score": 85},
            {"id": "TRX-103", "status": "Normal", "risk_score": 25},
            {"id": "TRX-104", "status": "Normal", "risk_score": 5},
            {"id": "TRX-105", "status": "Normal", "risk_score": 18}
        ]
    }
