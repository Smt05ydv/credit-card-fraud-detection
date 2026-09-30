import React, { useEffect, useState } from 'react';
import { getModelMetrics } from '../api';
import { Server, Settings, Cpu, Activity, BarChart3 } from 'lucide-react';

export default function ModelInfo() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelMetrics().then(data => {
      setMetrics(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800">Model Architectures & Metrics</h2>
      <p className="text-gray-600">
        The system employs multiple anomaly detection algorithms. Since fraud datasets are heavily imbalanced, 
        accuracy is misleading. <strong>PR-AUC</strong>, <strong>F1 Score</strong>, and <strong>Recall</strong> are the most important evaluation metrics.
      </p>
      
      {loading ? (
        <p>Loading metrics...</p>
      ) : metrics ? (
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(metrics).map(([modelName, modelMetrics]) => (
            <div key={modelName} className="card">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <Cpu className="text-blue-500" size={28} />
                <h3 className="text-xl font-bold">{modelName}</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                <MetricBox label="PR-AUC" value={modelMetrics.pr_auc} highlight />
                <MetricBox label="F1 Score" value={modelMetrics.f1} highlight />
                <MetricBox label="Recall" value={modelMetrics.recall} highlight />
                <MetricBox label="Precision" value={modelMetrics.precision} />
                <MetricBox label="ROC-AUC" value={modelMetrics.roc_auc} />
                <MetricBox label="Accuracy" value={modelMetrics.accuracy} />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2"><BarChart3 size={16}/> Confusion Matrix</h4>
                <div className="bg-gray-50 p-4 rounded-lg inline-block border">
                  <table className="text-sm text-center">
                    <tbody>
                      <tr>
                        <td className="p-2 text-gray-500 border-r border-b">True \ Pred</td>
                        <td className="p-2 font-medium border-b w-24">Normal</td>
                        <td className="p-2 font-medium border-b w-24">Anomaly</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium border-r text-left">Normal</td>
                        <td className="p-2 bg-green-100 text-green-800">{modelMetrics.confusion_matrix[0][0]} (TN)</td>
                        <td className="p-2 bg-red-50 text-red-600">{modelMetrics.confusion_matrix[0][1]} (FP)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium border-r text-left">Anomaly</td>
                        <td className="p-2 bg-red-50 text-red-600">{modelMetrics.confusion_matrix[1][0]} (FN)</td>
                        <td className="p-2 bg-green-100 text-green-800">{modelMetrics.confusion_matrix[1][1]} (TP)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500">Failed to load model metrics.</p>
      )}
    </div>
  );
}

function MetricBox({ label, value, highlight = false }) {
  return (
    <div className={`p-3 rounded border text-center ${highlight ? 'bg-blue-50 border-blue-100' : 'bg-gray-50'}`}>
      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-lg font-bold ${highlight ? 'text-blue-700' : 'text-gray-800'}`}>{value.toFixed(4)}</div>
    </div>
  );
}
