import React, { useState, useEffect } from 'react';
import { predictTransaction, getModels } from '../api';
import { AlertCircle, CheckCircle, ShieldAlert, Cpu, Activity, Zap } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
        <Activity className="text-indigo-400" />
        Transaction Interceptor
      </h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 card">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-700/50">
            <h3 className="font-semibold text-lg flex items-center gap-3 text-slate-200">
              <Cpu size={22} className="text-indigo-400" /> 
              Detection Matrix
            </h3>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <select 
                value={selectedModel} 
                onChange={e => setSelectedModel(e.target.value)}
                className="input-field relative py-1.5 px-4 text-sm w-auto font-medium cursor-pointer shadow-none"
              >
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-slate-300">Transaction Payload</h3>
            <div className="space-x-3">
              <button type="button" onClick={() => handleDemoData('normal')} className="text-xs bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg transition-all shadow-inner font-medium">Inject Normal Payload</button>
              <button type="button" onClick={() => handleDemoData('fraud')} className="text-xs bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg transition-all shadow-inner font-medium">Inject Anomaly Payload</button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Time</label>
                <input type="number" step="any" name="Time" value={formData.Time} onChange={handleChange} className="input-field font-mono text-sm" required />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</label>
                <input type="number" step="any" name="Amount" value={formData.Amount} onChange={handleChange} className="input-field font-mono text-sm" required />
              </div>
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={`V${i + 1}`} className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">V{i + 1}</label>
                  <input type="number" step="any" name={`V${i + 1}`} value={formData[`V${i + 1}`]} onChange={handleChange} className="input-field font-mono text-sm" required />
                </div>
              ))}
            </div>
            
            <button type="submit" disabled={loading} className="btn w-full flex justify-center items-center gap-2 py-3 text-lg">
              {loading ? (
                <span className="animate-pulse">Processing Neural Network...</span>
              ) : (
                <><Zap size={20} /> Execute Scan</>
              )}
            </button>
          </form>
        </div>

        <div>
          {error && (
            <div className="card border-rose-500/50 bg-rose-900/10 shadow-[0_0_20px_rgba(244,63,94,0.1)] mb-6 flex items-start gap-4">
              <AlertCircle className="text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-rose-400 mb-1">System Error</h4>
                <p className="text-sm text-slate-300">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="card relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700
                ${result.is_anomaly ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                
              <h3 className="font-bold text-xl mb-6 text-slate-100 flex items-center gap-2">
                Scan Results
              </h3>
              
              <div className={`p-5 rounded-xl border mb-6 flex items-center gap-4 transition-all duration-300
                ${result.is_anomaly 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[inset_0_0_20px_rgba(244,63,94,0.1)]' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]'}`}>
                {result.is_anomaly ? <ShieldAlert size={36} className="shrink-0" /> : <CheckCircle size={36} className="shrink-0" />}
                <div>
                  <div className="text-sm tracking-widest uppercase opacity-80 mb-0.5">Prediction Match</div>
                  <div className={`text-2xl font-bold tracking-wide ${result.is_anomaly ? 'text-glow-red' : 'text-glow-green'}`}>
                    {result.prediction}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                  <span className="text-slate-400">Threat Level</span>
                  <span className={`font-semibold px-3 py-1 rounded-md text-sm border
                    ${result.risk_level === 'High Risk' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : result.risk_level === 'Medium Risk' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {result.risk_level}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                  <span className="text-slate-400">Risk Score Metric</span>
                  <span className="font-mono text-lg text-slate-200">{result.risk_score} <span className="text-slate-500 text-sm">/ 100</span></span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                  <span className="text-slate-400">Anomaly Confidence</span>
                  <span className="font-mono text-slate-300">{result.anomaly_score.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-400">Engine Used</span>
                  <span className="text-indigo-400 font-medium">{result.model_used}</span>
                </div>
              </div>
            </div>
          )}
          
          {!result && !error && (
            <div className="card border border-dashed border-slate-700 bg-slate-900/20 flex flex-col items-center justify-center h-64 text-slate-500">
              <Zap size={48} className="mb-4 opacity-20" />
              <p>Awaiting payload execution...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
