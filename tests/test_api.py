import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
from main import app, init_db

# Make sure DB exists for tests
init_db()

def test_health_check():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

def test_model_info():
    with TestClient(app) as client:
        response = client.get("/api/models")
        assert response.status_code == 200
        assert "models" in response.json()

def test_predict_normal():
    with TestClient(app) as client:
        # Construct normal looking payload
        payload = {"Time": 10.0, "Amount": 50.0}
        for i in range(1, 29):
            payload[f"V{i}"] = 0.1
            
        response = client.post("/api/predict", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "prediction" in data
        assert "is_anomaly" in data
        assert "anomaly_score" in data
        assert "risk_score" in data
        assert "risk_level" in data
        assert "model_used" in data
        assert "timestamp" in data

def test_predict_invalid_input():
    with TestClient(app) as client:
        # Missing fields
        payload = {"Time": 10.0}
        response = client.post("/api/predict", json=payload)
        assert response.status_code == 422 # Validation error
