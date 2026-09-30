# Beginner's Guide to Credit Card Fraud Detection

Welcome! If you are new to programming or machine learning, this guide will explain everything in simple terms.

## 1. What this project does
This project looks at credit card transactions and guesses if they are normal or potentially fake (fraud). It does this by looking at patterns instead of rigid rules.

## 2. What anomaly detection means
Imagine a room full of people wearing blue shirts, and one person walks in wearing a bright pink suit. The pink suit is an "anomaly" (something unusual). In credit card fraud, a transaction that looks very different from the rest is an anomaly and might be fraud.

## 3. What Isolation Forest means
Isolation Forest is the specific mathematical tool (algorithm) we use. Think of it like a game of 20 questions. If I can guess who you are in only 2 questions, you are very unique (an anomaly). If it takes me 20 questions, you are normal. This algorithm separates (isolates) rare transactions very quickly.

## 4. What backend means
The backend is the "brain" of the application. It runs on a server, does the heavy math, holds the machine learning model, and handles files. We wrote it in Python using a tool called FastAPI.

## 5. What frontend means
The frontend is the "face" of the application. It is what you see on your screen: buttons, colors, and charts. We built it using React.

## 6. How frontend communicates with backend
They talk using the internet (or local network) via HTTP. The frontend says "Here are transaction details, please check them" and the backend replies "It is an Anomaly! Risk is High".

## 7. What API means
API (Application Programming Interface) is like a waiter in a restaurant. You (frontend) give your order to the waiter (API), the waiter takes it to the kitchen (backend), and brings the food (results) back to you.

## 8. What the model does
The "model" is a saved file containing patterns the algorithm learned during training. When a new transaction arrives, the model compares it to what it learned and gives an "anomaly score".

## 9. How to start backend
Open your terminal, go to the project folder, and run:
`source venv/bin/activate` (to turn on your python environment)
`cd backend`
`python -m uvicorn main:app --reload`
Now the brain is running on port 8000!

## 10. How to start frontend
Open a second terminal, go to `credit-card-fraud-detection/frontend`, and run:
`npm run dev`
Now the face is running on your browser! (Usually http://localhost:5173)

## 11. How to upload CSV
Go to the "Batch CSV Analysis" page. Click the dashed box to select a CSV file. A CSV is just a spreadsheet. Click "Analyze" and the backend will check every row.

## 12. How to make a prediction
Go to "Transaction Detection". Fill in the numbers (Time, Amount, V1-V28). Click "Detect".

## 13. How to interpret the result
If it says "Normal", the transaction looks fine.
If it says "Potential Fraud", it looks weird.
The Risk Score (0-100) helps you see how weird it is. 100 means extremely weird!

## 14. How to stop the project
Go to your terminals running the code and press `Ctrl + C`.

## 15. How to restart it
Just repeat steps 9 and 10!
