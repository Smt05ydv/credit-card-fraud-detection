import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score, f1_score
from generate_data import generate_synthetic_data

def train_model(data_path="../data/synthetic_dataset.csv", model_dir="../backend/models"):
    print(f"Loading data from {data_path}...")
    if not os.path.exists(data_path):
        print("Dataset not found. Generating synthetic dataset...")
        generate_synthetic_data(output_path=data_path)
    
    df = pd.read_csv(data_path)
    
    # We will use Time, V1-V28, and Amount as features.
    # Class is strictly for evaluation.
    features = [col for col in df.columns if col != "Class"]
    X = df[features]
    
    if "Class" in df.columns:
        y = df["Class"]
    else:
        y = None
        
    print("Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    print("Training Isolation Forest...")
    # Assume 1% contamination if not known. 
    # It represents the proportion of outliers in the data set.
    iso_forest = IsolationForest(n_estimators=100, contamination=0.01, random_state=42)
    iso_forest.fit(X_scaled)
    
    # Evaluate if labels are available
    if y is not None:
        print("Evaluating model...")
        # predict returns 1 for normal, -1 for anomaly
        predictions = iso_forest.predict(X_scaled)
        # Convert to 0 for normal, 1 for anomaly to match 'Class'
        y_pred = np.where(predictions == 1, 0, 1)
        
        print("Confusion Matrix:")
        print(confusion_matrix(y, y_pred))
        print("\nClassification Report:")
        print(classification_report(y, y_pred))
        
        print(f"Precision: {precision_score(y, y_pred):.4f}")
        print(f"Recall: {recall_score(y, y_pred):.4f}")
        print(f"F1 Score: {f1_score(y, y_pred):.4f}")
        print("\nNote: Accuracy is not a good metric for highly imbalanced fraud datasets.")
        
    # Save model and scaler
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(iso_forest, os.path.join(model_dir, "isolation_forest.joblib"))
    joblib.dump(scaler, os.path.join(model_dir, "scaler.joblib"))
    print(f"Model and scaler saved to {model_dir}")

if __name__ == "__main__":
    train_model()
