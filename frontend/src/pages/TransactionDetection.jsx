import React, { useState, useEffect } from 'react';
import { predictTransaction, getModels } from '../api';
import { AlertCircle, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';

export default function TransactionDetection() {
  const [models, setModels] = useState(['Isolation Forest']);
  const [selectedModel, setSelectedModel] = useState('Isolation Forest');
  
  const [formData, setFormData] = useState({
    Time: 0, Amount: 0,
    ...Object.fromEntries(Array.from({ length: 28 }, (_, i) => [`V${i + 1}`, 0]))
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getModels().then(data => {
      if (data && data.models) setModels(data.models);
    }).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handleDemoData = (type) => {
    if (type === 'normal') {
      setFormData({
        Time: 100, Amount: 25.5,
        ...Object.fromEntries(Array.from({ length: 28 }, (_, i) => [`V${i + 1}`, 0.1]))
      });
    } else {
      setFormData({
        Time: 200, Amount: 1500.0,
        ...Object.fromEntries(Array.from({ length: 28 }, (_, i) => [`V${i + 1}`, 5.5]))
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await predictTransaction(formData, selectedModel);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Single Transaction Detection</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Cpu size={20}/> Detection Engine</h3>
            <select 
              value={selectedModel} 
              onChange={e => setSelectedModel(e.target.value)}
              className="input-field py-1 px-3 text-sm w-auto font-medium"
            >
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          
          <div className="flex justify-between items-center mb-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Transaction Details</h3>
            <div className="space-x-2">
              <button onClick={() => handleDemoData('normal')} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Load Demo Normal</button>
              <button onClick={() => handleDemoData('fraud')} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded">Load Demo Fraud</button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                <input type="number" step="any" name="Time" value={formData.Time} onChange={handleChange} className="input-field py-1 px-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="any" name="Amount" value={formData.Amount} onChange={handleChange} className="input-field py-1 px-2 text-sm" required />
              </div>
              {Array.from({ length: 28 }, (_, i) => i + 1).map(i => (
                <div key={i}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">V{i}</label>
                  <input type="number" step="any" name={`V${i}`} value={formData[`V${i}`]} onChange={handleChange} className="input-field py-1 px-2 text-sm" required />
                </div>
              ))}
            </div>
            <button type="submit" className="btn w-full flex justify-center items-center gap-2" disabled={loading}>
              {loading ? 'Analyzing...' : <>Detect Transaction <ShieldAlert size={16}/></>}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex gap-2"><AlertCircle size={20}/> {error}</div>}
          
          {result && (
            <div className={`card border-t-4 ${result.is_anomaly ? 'border-t-red-500 bg-red-50' : 'border-t-green-500 bg-green-50'}`}>
              <h3 className="font-bold text-lg mb-2">Detection Result</h3>
              
              <div className="flex items-center gap-3 mb-4">
                {result.is_anomaly ? <AlertCircle className="text-red-500" size={32}/> : <CheckCircle className="text-green-500" size={32}/>}
                <div>
                  <p className={`text-xl font-bold ${result.is_anomaly ? 'text-red-600' : 'text-green-600'}`}>
                    {result.prediction}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 bg-white p-4 rounded border border-gray-100">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Anomaly Score</span>
                  <span className="font-mono font-medium">{result.anomaly_score}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Risk Score</span>
                  <span className="font-mono font-medium">{result.risk_score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level</span>
                  <span className={`font-medium ${
                    result.risk_level === 'High Risk' ? 'text-red-600' : 
                    result.risk_level === 'Medium Risk' ? 'text-orange-500' : 'text-green-600'
                  }`}>{result.risk_level}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                This risk score is a project-defined indicator based on anomaly detection and is not an official banking risk score.
              </p>
            </div>
          )}
          
          {!result && !error && (
            <div className="card h-full flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
              <ShieldAlert size={48} className="mb-4 opacity-20" />
              <p>Submit a transaction to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
