import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "transactions.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            amount REAL,
            model_used TEXT NOT NULL,
            prediction TEXT NOT NULL,
            anomaly_score REAL NOT NULL,
            risk_score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            features_json TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def insert_transaction(amount: float, model_used: str, prediction: str, 
                       anomaly_score: float, risk_score: int, risk_level: str, features: dict) -> int:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute('''
        INSERT INTO transactions (timestamp, amount, model_used, prediction, anomaly_score, risk_score, risk_level, features_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (now, amount, model_used, prediction, anomaly_score, risk_score, risk_level, json.dumps(features)))
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()
    return inserted_id

def get_transactions(limit=100, offset=0, risk_filter=None, prediction_filter=None):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    query = "SELECT id, timestamp, amount, model_used, prediction, anomaly_score, risk_score, risk_level FROM transactions WHERE 1=1"
    params = []
    
    if risk_filter:
        query += " AND risk_level = ?"
        params.append(risk_filter)
        
    if prediction_filter:
        query += " AND prediction = ?"
        params.append(prediction_filter)
        
    query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

def get_transaction_by_id(tx_id: int):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (tx_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None
