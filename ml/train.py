import pandas as pd
import numpy as np
import os
import joblib
import json
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score, f1_score, accuracy_score, roc_auc_score, average_precision_score
from generate_data import generate_synthetic_data

def train_and_evaluate(model, model_name, X_train, X_test, y_test, model_dir):
    print(f"\nTraining {model_name}...")
    model.fit(X_train)
    
    metrics = {}
    if y_test is not None:
        print(f"Evaluating {model_name}...")
        
        # predict returns 1 for normal, -1 for anomaly
        predictions = model.predict(X_test)
        y_pred = np.where(predictions == 1, 0, 1)
        
        # decision function gives scores (higher is more normal, lower is more anomalous usually)
        # for ROC-AUC we need scores where higher means anomaly
        if hasattr(model, 'decision_function'):
            scores = -model.decision_function(X_test)
        else:
            # LOF with novelty=True doesn't have decision_function natively, it has score_samples
            scores = -model.score_samples(X_test)
            
        cm = confusion_matrix(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        acc = accuracy_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, scores)
        pr_auc = average_precision_score(y_test, scores)
        
        print(f"Confusion Matrix:\n{cm}")
        print(f"Accuracy: {acc:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1 Score: {f1:.4f}")
        print(f"ROC-AUC: {roc_auc:.4f}")
        print(f"PR-AUC: {pr_auc:.4f}")
        
        metrics = {
            "accuracy": round(acc, 4),
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "pr_auc": round(pr_auc, 4),
            "confusion_matrix": cm.tolist()
        }
    
    # Save model
    joblib.dump(model, os.path.join(model_dir, f"{model_name.lower().replace(' ', '_')}.joblib"))
    return metrics

def train_models(data_path="../data/synthetic_dataset.csv", model_dir="../backend/models"):
    print(f"Loading data from {data_path}...")
    if not os.path.exists(data_path):
        print("Dataset not found. Generating synthetic dataset...")
        generate_synthetic_data(output_path=data_path)
    
    df = pd.read_csv(data_path)
    
    features = [col for col in df.columns if col != "Class"]
    X = df[features]
    y = df["Class"] if "Class" in df.columns else None
        
    print("Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(scaler, os.path.join(model_dir, "scaler.joblib"))
    
    # For training one-class models, it is technically best to train only on normal data.
    # However, if contamination is set, sklearn models handle the mix.
    # We will use the whole set for IsolationForest, but for OCSVM and LOF we will fit on the whole set
    # assuming anomaly detection (novelty=True for LOF).
    
    models = {
        "Isolation Forest": IsolationForest(n_estimators=100, contamination=0.01, random_state=42),
        "Local Outlier Factor": LocalOutlierFactor(n_neighbors=20, contamination=0.01, novelty=True),
        "One Class SVM": OneClassSVM(nu=0.01, kernel="rbf", gamma="scale")
    }
    
    all_metrics = {}
    for name, model in models.items():
        metrics = train_and_evaluate(model, name, X_scaled, X_scaled, y, model_dir)
        all_metrics[name] = metrics
        
    # Save metrics
    with open(os.path.join(model_dir, "metrics.json"), "w") as f:
        json.dump(all_metrics, f, indent=4)
        
    print(f"\nAll models and scaler saved to {model_dir}")
    print("Remember: Fraud datasets are highly imbalanced, Accuracy is not a reliable metric. Look at PR-AUC, F1, and Recall.")

if __name__ == "__main__":
    train_models()
