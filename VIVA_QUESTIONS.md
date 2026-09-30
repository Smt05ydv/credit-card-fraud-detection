# Viva Questions & Answers

**Q1: What is the problem statement of your project?**
A: Credit card fraud is increasing, and detecting it is hard because fraud transactions are very rare compared to normal ones. Standard classification models fail because of this imbalance.

**Q2: What is Anomaly Detection?**
A: It is the process of finding data points that are rare, unusual, or differ significantly from the majority of the data.

**Q3: What algorithm did you use?**
A: I used Isolation Forest.

**Q4: How does Isolation Forest work?**
A: It builds random decision trees. Because anomalies are different and rare, they get isolated closer to the root of the tree (shorter path lengths) compared to normal data points.

**Q5: Is Isolation Forest supervised or unsupervised?**
A: It is an unsupervised learning algorithm. It doesn't need labeled data (fraud/not fraud) to find anomalies, it just looks for outliers.

**Q6: What is the `contamination` parameter?**
A: It is the expected proportion of anomalies in the dataset. I set it based on an estimation of how much fraud exists in the data.

**Q7: What is an anomaly score?**
A: It's a number given by the model. Negative scores usually indicate anomalies, while positive scores indicate normal observations.

**Q8: Why do we need feature scaling?**
A: Machine learning algorithms that calculate distances or variance are sensitive to the scale of the data. Scaling (like StandardScaler) ensures all features contribute equally.

**Q9: What is data leakage?**
A: It happens when information from outside the training dataset is used to create the model, leading to artificially high performance. We avoid this by not using the 'Class' label as a feature.

**Q10: Why is Accuracy a bad metric for fraud datasets?**
A: If a dataset has 99.9% normal transactions, a model that simply guesses "Normal" every time will be 99.9% accurate, but it will detect 0 frauds.

**Q11: What is Precision?**
A: Out of all the transactions the model flagged as fraud, how many were actually fraud?

**Q12: What is Recall?**
A: Out of all the actual fraud transactions, how many did the model successfully detect?

**Q13: What is the F1 Score?**
A: It is the harmonic mean of Precision and Recall. It provides a balance between the two.

**Q14: What is an imbalanced dataset?**
A: A dataset where the classes are not represented equally. E.g., 284,000 normal transactions and only 492 fraud transactions.

**Q15: What backend framework did you use?**
A: I used FastAPI in Python.

**Q16: Why FastAPI?**
A: It is fast, modern, natively supports asynchronous programming, and automatically generates API documentation.

**Q17: What is a REST API?**
A: Representational State Transfer. It is a set of rules for communication between a client (frontend) and a server (backend) using standard HTTP methods like GET and POST.

**Q18: What frontend library did you use?**
A: I used React JS.

**Q19: How does the frontend communicate with the backend?**
A: Through HTTP requests using the `axios` library. It sends data to the FastAPI endpoints and receives JSON responses.

**Q20: How did you process the CSV file on the backend?**
A: The frontend sends the CSV as a file payload (multipart/form-data). FastAPI reads it into memory, passes it to Pandas to create a DataFrame, scales the data, and runs it through the model.

**Q21: What is model persistence?**
A: It is the act of saving a trained model to disk so it can be used later without retraining. I used `joblib` for this.

**Q22: Why save the scaler?**
A: New data must be scaled using the exact same mean and standard deviation that the model was trained on.

**Q23: What does Vite do?**
A: Vite is a modern frontend build tool that is much faster than Create React App for serving and building React projects.

**Q24: What is Tailwind CSS?**
A: It is a utility-first CSS framework that allows building custom designs directly in the HTML/JSX by using predefined classes.

**Q25: What are V1 to V28 features?**
A: In standard credit card datasets (like the Kaggle one), they are the principal components obtained using PCA (Principal Component Analysis) to hide user identities and sensitive information.

**Q26: What happens if the CSV is missing columns?**
A: The backend validates the columns. If required columns are missing, it throws a 400 Bad Request error, which is caught and displayed nicely on the frontend.

**Q27: What is CORS?**
A: Cross-Origin Resource Sharing. It is a security feature that restricts web applications from making requests to a different domain. We configure the backend to allow requests from our React frontend.

**Q28: How do you handle exceptions in your API?**
A: I use FastAPI's `HTTPException` to return proper HTTP status codes and error details instead of crashing the server.

**Q29: What are the limitations of your project?**
A: Isolation Forest is sensitive to hyperparameters, and unsupervised models can sometimes flag legitimate unusual behavior (like a sudden large purchase) as fraud (false positives).

**Q30: What are some future improvements?**
A: Adding a database to save transaction history, implementing user login, and combining the Isolation Forest with a supervised model for a hybrid approach.
