# Viva Questions & Answers

**Q1: What is the problem statement of your project?**
A: Credit card fraud is increasing, and detecting it is hard because fraud transactions are very rare compared to normal ones. Standard classification models fail because of this imbalance.

**Q2: What is Anomaly Detection?**
A: It is the process of finding data points that are rare, unusual, or differ significantly from the majority of the data.

**Q3: What algorithms did you use?**
A: I implemented three anomaly detection models: Isolation Forest, Local Outlier Factor (LOF), and One-Class SVM (OCSVM).

**Q4: How does Isolation Forest work?**
A: It builds random decision trees. Because anomalies are different and rare, they get isolated closer to the root of the tree (shorter path lengths) compared to normal data points.

**Q5: How does Local Outlier Factor work?**
A: LOF computes the local density deviation of a data point with respect to its neighbors. It considers as outliers the samples that have a substantially lower density than their neighbors.

**Q6: How does One-Class SVM work?**
A: It attempts to separate the data from the origin in a high-dimensional space, effectively creating a boundary that encompasses the normal data points. Anything outside this boundary is flagged as an anomaly.

**Q7: Is Isolation Forest supervised or unsupervised?**
A: It is an unsupervised learning algorithm. It doesn't need labeled data (fraud/not fraud) to find anomalies, it just looks for outliers.

**Q8: What is the `contamination` parameter?**
A: It is the expected proportion of anomalies in the dataset. I set it based on an estimation of how much fraud exists in the data.

**Q9: What is an anomaly score?**
A: It's a number given by the model indicating confidence. Negative scores usually indicate anomalies, while positive scores indicate normal observations.

**Q10: Why do we need feature scaling?**
A: Machine learning algorithms that calculate distances or variance (like LOF and SVM) are highly sensitive to the scale of the data. Scaling (like StandardScaler) ensures all features contribute equally.

**Q11: What is data leakage?**
A: It happens when information from outside the training dataset is used to create the model, leading to artificially high performance. We avoid this by not using the 'Class' label as a feature.

**Q12: Why is Accuracy a bad metric for fraud datasets?**
A: If a dataset has 99.9% normal transactions, a model that simply guesses "Normal" every time will be 99.9% accurate, but it will detect 0 frauds.

**Q13: What is Precision?**
A: Out of all the transactions the model flagged as fraud, how many were actually fraud?

**Q14: What is Recall?**
A: Out of all the actual fraud transactions, how many did the model successfully detect?

**Q15: What is the F1 Score?**
A: It is the harmonic mean of Precision and Recall. It provides a balance between the two.

**Q16: What are ROC-AUC and PR-AUC?**
A: ROC-AUC is the area under the Receiver Operating Characteristic curve. PR-AUC is the area under the Precision-Recall curve. PR-AUC is highly recommended for highly imbalanced datasets.

**Q17: What backend framework did you use?**
A: I used FastAPI in Python.

**Q18: Why FastAPI?**
A: It is fast, modern, natively supports asynchronous programming, and automatically generates API documentation.

**Q19: What is a REST API?**
A: Representational State Transfer. It is a set of rules for communication between a client (frontend) and a server (backend) using standard HTTP methods like GET and POST.

**Q20: What database did you use and why?**
A: I used SQLite. It is a lightweight, serverless relational database perfectly suited for saving transaction history locally without complex infrastructure setup.

**Q21: What frontend library did you use?**
A: I used React JS built with Vite, styled with Tailwind CSS.

**Q22: How does the frontend communicate with the backend?**
A: Through HTTP requests using the `axios` library. It sends data to the FastAPI endpoints and receives JSON responses.

**Q23: How did you process the CSV file on the backend?**
A: The frontend sends the CSV as a file payload. FastAPI reads it into memory, passes it to Pandas to create a DataFrame, scales the data, and runs it through the chosen model.

**Q24: What is model persistence?**
A: It is the act of saving a trained model to disk so it can be used later without retraining. I used `joblib` for this.

**Q25: Why save the scaler?**
A: New data must be scaled using the exact same mean and standard deviation that the model was trained on, otherwise the predictions will be entirely inaccurate.

**Q26: What does Vite do?**
A: Vite is a modern frontend build tool that is much faster than Create React App for serving and building React projects.

**Q27: What is Tailwind CSS?**
A: It is a utility-first CSS framework that allows building custom designs directly in the HTML/JSX by using predefined classes.

**Q28: What happens if the CSV is missing columns?**
A: The backend validates the columns. If required columns are missing, it throws a 400 Bad Request error, which is caught and displayed nicely on the frontend.

**Q29: What is CORS?**
A: Cross-Origin Resource Sharing. It is a security feature that restricts web applications from making requests to a different domain. We configure the backend to allow requests from our React frontend.

**Q30: What are the limitations of your project?**
A: Unsupervised models can sometimes flag legitimate unusual behavior (like a sudden large purchase) as fraud (false positives). Furthermore, models like OCSVM can be computationally heavy for massive streaming datasets.
