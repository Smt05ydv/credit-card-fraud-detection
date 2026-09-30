import React, { useEffect, useState } from 'react';
import { getModelInfo } from '../api';
import { Server, Settings, Cpu } from 'lucide-react';

export default function ModelInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelInfo().then(data => {
      setInfo(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800">Model Information</h2>
      
      <div className="card">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <Cpu className="text-blue-500" size={32} />
          <div>
            <h3 className="text-xl font-bold">Isolation Forest</h3>
            <p className="text-gray-500">Unsupervised Anomaly Detection Model</p>
          </div>
        </div>
        
        {loading ? (
          <p>Loading parameters...</p>
        ) : info ? (
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-lg mb-3">
                <Settings size={20} /> Current Parameters
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded border">
                  <div className="text-sm text-gray-500">n_estimators</div>
                  <div className="text-xl font-bold font-mono">{info.parameters.n_estimators}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                  <div className="text-sm text-gray-500">contamination</div>
                  <div className="text-xl font-bold font-mono">{info.parameters.contamination}</div>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none text-gray-700">
              <h4 className="font-semibold text-lg">How it Works</h4>
              <p className="mb-2">
                Isolation Forest detects anomalies purely based on the fact that anomalies are data points that are few and different. 
                As a result of these properties, anomalies are susceptible to a mechanism called isolation.
              </p>
              <p>
                The algorithm recursively generates partitions on the dataset by randomly selecting a feature and then randomly selecting a split value. 
                Since anomalies are rare and different, they require fewer random splits to be isolated compared to normal points. 
                Therefore, a shorter path length in the tree indicates a higher likelihood of the point being an anomaly.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Failed to load model info.</p>
        )}
      </div>
    </div>
  );
}
