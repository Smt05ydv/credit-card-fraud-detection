import pandas as pd
import numpy as np
import os

def generate_synthetic_data(num_samples=5000, fraud_ratio=0.01, output_path="../data/synthetic_dataset.csv"):
    np.random.seed(42)
    
    # Generate Normal Transactions
    num_normal = int(num_samples * (1 - fraud_ratio))
    num_fraud = num_samples - num_normal
    
    # Features V1-V28 (simulated as normal distributions)
    normal_features = np.random.normal(loc=0.0, scale=1.0, size=(num_normal, 28))
    # Normal amounts (right skewed)
    normal_amounts = np.random.exponential(scale=50, size=(num_normal, 1))
    normal_time = np.random.uniform(0, 100000, size=(num_normal, 1))
    
    # Generate Fraud Transactions (simulated as outliers/different distribution)
    fraud_features = np.random.normal(loc=3.0, scale=2.5, size=(num_fraud, 28))
    fraud_amounts = np.random.exponential(scale=200, size=(num_fraud, 1))
    fraud_time = np.random.uniform(0, 100000, size=(num_fraud, 1))
    
    # Combine
    X_normal = np.hstack((normal_time, normal_features, normal_amounts))
    y_normal = np.zeros((num_normal, 1))
    
    X_fraud = np.hstack((fraud_time, fraud_features, fraud_amounts))
    y_fraud = np.ones((num_fraud, 1))
    
    data = np.vstack((np.hstack((X_normal, y_normal)), np.hstack((X_fraud, y_fraud))))
    
    # Shuffle
    np.random.shuffle(data)
    
    columns = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount", "Class"]
    df = pd.DataFrame(data, columns=columns)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Synthetic dataset created at {output_path} with {num_samples} records.")
    
if __name__ == "__main__":
    generate_synthetic_data()
