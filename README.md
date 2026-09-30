# Credit Card Fraud Detection Using Anomaly Detection Techniques

## Project Overview
This is a full-stack web application designed to detect potentially fraudulent credit card transactions using unsupervised machine learning. Traditional fraud detection systems often struggle with highly imbalanced datasets. This project solves that by utilizing Anomaly Detection (Isolation Forest), which identifies rare and unusual data points that deviate from normal patterns.

## Problem Statement
Credit card fraud costs billions annually. The dataset is heavily imbalanced (frauds are <0.2% of all transactions), making standard classification algorithms biased toward the majority class. 

## Objectives
- Build a robust unsupervised machine learning pipeline to identify anomalies.
- Develop a high-performance REST API using FastAPI.
- Create an intuitive, modern dashboard using React to interact with the model.

## Features
- **Dashboard:** Real-time statistics and visualizations of normal vs. anomalous transactions.
- **Transaction Detection:** Real-time form to submit transaction details and get a prediction using your choice of model.
- **Batch CSV Analysis:** Upload large CSV files for batch prediction using your choice of model.
- **Multi-Model Support:** Choose between Isolation Forest, Local Outlier Factor, and One-Class SVM on the fly.
- **Transaction History:** Persistent SQLite database storing all predictions, searchable by risk and prediction filters.
- **Risk Scoring:** Custom 0-100 risk score and level mapping based on algorithm confidence.

## Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, Recharts
- **Backend:** Python, FastAPI, Uvicorn, SQLite
- **Machine Learning:** scikit-learn (Isolation Forest, LOF, OCSVM), Pandas, NumPy

## Architecture
1. **Frontend:** Sends user input or CSV files via HTTP POST.
2. **Backend API:** Receives data, scales it using pre-fit StandardScaler.
3. **ML Model:** Isolation Forest evaluates the data and returns an anomaly score.
4. **Backend API:** Calculates Risk Score based on the anomaly score and sends JSON response.
5. **Frontend:** Displays parsed data, charts, and downloadable reports.

## Dataset
- Real Dataset: Not included due to size and privacy. 
- A synthetic dataset generator is provided (`ml/generate_data.py`) to run the project immediately.
- Place real datasets in the `data/` folder if available.

## Installation & Running Instructions

### 1. Backend & ML
```bash
cd credit-card-fraud-detection
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install requirements
pip install -r backend/requirements.txt

# Generate synthetic dataset and Train the model
cd ml
python train.py
cd ..

# Run FastAPI Server
cd backend
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend
Open a new terminal.
```bash
cd credit-card-fraud-detection/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Results
- The model successfully isolates fraudulent outliers from synthetic normal distributions.
- Precision/Recall metrics are available in backend console logs when trained on labeled datasets.

## Limitations
- Isolation Forest is sensitive to the `contamination` parameter which needs manual tuning.
- Real-world streaming data requires periodic model retraining.

## Future Scope
- Integrating a database (PostgreSQL/MongoDB) to store transaction history.
- Implementing an ensemble method (Isolation Forest + Autoencoders).
- Adding user authentication.
