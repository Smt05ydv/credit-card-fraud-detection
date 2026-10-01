import React, { useState, useEffect } from 'react';
import { predictBatch, getModels } from '../api';
import { Upload, FileSpreadsheet, Download, AlertCircle, Cpu, Zap, Activity } from 'lucide-react';

export default function BatchCSVAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [models, setModels] = useState(['Isolation Forest']);
  const [selectedModel, setSelectedModel] = useState('Isolation Forest');

  useEffect(() => {
    getModels().then(data => {
      if (data && data.models) setModels(data.models);
    }).catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await predictBatch(file, selectedModel);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during CSV processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
        <FileSpreadsheet className="text-indigo-400" />
        Batch CSV Analysis
      </h2>
      
      <div className="card max-w-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-700/50 pb-6 relative z-10">
          <p className="text-slate-400 text-sm max-w-md">
            Upload a batch CSV file for parallel execution. Schema required: <code className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-xs">Time, V1..V28, Amount</code>.
          </p>
          <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50 shadow-inner">
            <Cpu size={18} className="text-indigo-400 ml-2"/>
            <select 
              value={selectedModel} 
              onChange={e => setSelectedModel(e.target.value)}
              className="input-field py-1.5 px-3 text-sm w-auto bg-transparent border-none shadow-none focus:ring-0 cursor-pointer text-slate-200"
            >
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        
        <div className="border-2 border-dashed border-indigo-500/30 rounded-2xl p-10 text-center bg-slate-800/20 hover:bg-slate-800/40 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer relative shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] group/dropzone z-10">
          <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
          
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover/dropzone:scale-110 transition-transform duration-300 group-hover/dropzone:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Upload size={32} className="text-indigo-400" />
          </div>
          
          {file ? (
            <div>
              <p className="font-semibold text-indigo-300 text-lg">{file.name}</p>
              <p className="text-sm text-slate-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-slate-300 text-lg">Initialize Batch Upload</p>
              <p className="text-sm text-slate-500 mt-1">Drag & drop or click to browse</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end relative z-10">
          <button 
            onClick={handleUpload} 
            disabled={!file || loading}
            className="btn w-full md:w-auto flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Running Execution Protocol...</span>
            ) : (
              <><Zap size={18}/> Process Dataset</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="card border-rose-500/50 bg-rose-900/10 shadow-[0_0_20px_rgba(244,63,94,0.1)] flex items-start gap-4">
          <AlertCircle className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-400 mb-1">Execution Failure</h4>
            <p className="text-sm text-slate-300">{error}</p>
          </div>
        </div>
      )}

      {results && (
        <div className="card space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-indigo-500"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-xl text-slate-100 flex items-center gap-2">
                <Activity className="text-emerald-400" />
                Batch Results: <span className="text-indigo-400">{results.summary.model_used}</span>
              </h3>
              <p className="text-slate-400 text-sm mt-1">Successfully scanned {results.summary.total_rows} records</p>
            </div>
            
            <div className="flex gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 shadow-inner">
              <div className="text-center px-4 border-r border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase">Anomalies</p>
                <p className="font-bold text-xl text-rose-400">{results.summary.anomaly_count}</p>
              </div>
              <div className="text-center px-4 border-r border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase">High Risk</p>
                <p className="font-bold text-xl text-amber-400">{results.summary.high_risk_count}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-slate-500 uppercase">Detection Rate</p>
                <p className="font-bold text-xl text-indigo-400">{results.summary.anomaly_percentage}%</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-slate-700/50 shadow-inner">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">Row</th>
                  <th className="px-4 py-3">Prediction</th>
                  <th className="px-4 py-3">Anomaly Score</th>
                  <th className="px-4 py-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {results.results.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-300">{row.row_index}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border
                        ${row.is_anomaly 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'}`}>
                        {row.prediction}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{row.anomaly_score.toFixed(4)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold text-sm
                        ${row.risk_level === 'High Risk' ? 'text-rose-400' 
                        : row.risk_level === 'Medium Risk' ? 'text-amber-400' 
                        : 'text-emerald-400'}`}>
                        {row.risk_level} ({row.risk_score})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
