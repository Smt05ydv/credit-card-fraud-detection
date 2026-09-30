import React from 'react';
import { Info, Github, User } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800">About the Project</h2>
      
      <div className="card space-y-6 text-gray-700">
        <section>
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Info size={24} className="text-blue-500" /> Project Overview
          </h3>
          <p>
            This system, "Credit Card Fraud Detection Using Anomaly Detection Techniques", is a full-stack application designed to identify potentially fraudulent transactions without relying on heavily imbalanced labeled data for training. 
            By utilizing the <strong>Isolation Forest</strong> algorithm (an unsupervised machine learning method), the system detects patterns that deviate significantly from normal transaction behavior.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Technology Stack</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Frontend:</strong> React, Vite, Tailwind CSS, Recharts</li>
            <li><strong>Backend:</strong> Python, FastAPI</li>
            <li><strong>Machine Learning:</strong> scikit-learn, Pandas, NumPy</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-2">Key Features</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Real-time single transaction detection</li>
            <li>Batch processing of CSV files</li>
            <li>Project-defined risk scoring mechanism</li>
            <li>Interactive dashboard with data visualization</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
