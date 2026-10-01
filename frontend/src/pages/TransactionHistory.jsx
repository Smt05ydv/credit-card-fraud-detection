import React, { useEffect, useState } from 'react';
import { getTransactions } from '../api';
import { Search, Filter, Database, Server } from 'lucide-react';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState('');
  const [filterPred, setFilterPred] = useState('');

  useEffect(() => {
    loadData();
  }, [filterRisk, filterPred]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getTransactions({
        risk_filter: filterRisk || undefined,
        prediction_filter: filterPred || undefined
      });
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
        <Database className="text-indigo-400" />
        Global Neural History
      </h2>
      
      <div className="card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-1 bg-gradient-to-l from-indigo-500 to-transparent"></div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-slate-700/50 relative z-10">
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700/50 shadow-inner">
            <Filter size={16} className="text-indigo-400" />
            <span className="text-sm font-medium text-slate-300">Filters:</span>
          </div>
          
          <select 
            className="input-field py-1.5 px-3 text-sm w-auto cursor-pointer" 
            value={filterRisk} 
            onChange={(e) => setFilterRisk(e.target.value)}
          >
            <option value="">All Threat Levels</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Medium Risk">Medium Risk</option>
            <option value="High Risk">High Risk</option>
          </select>
          
          <select 
            className="input-field py-1.5 px-3 text-sm w-auto cursor-pointer" 
            value={filterPred} 
            onChange={(e) => setFilterPred(e.target.value)}
          >
            <option value="">All Predictions</option>
            <option value="Normal">Normal</option>
            <option value="Potential Fraud / Anomaly">Anomaly</option>
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 animate-pulse flex flex-col items-center gap-3">
            <Server size={32} className="text-indigo-500/50" />
            <span>Querying Mainframe...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
            <Database size={32} className="opacity-20" />
            <span>No telemetry found in database.</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-700/50 shadow-inner">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-800/50">
                <tr>
                  <th className="px-4 py-4">Trace ID</th>
                  <th className="px-4 py-4">Timestamp</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Engine</th>
                  <th className="px-4 py-4">Prediction</th>
                  <th className="px-4 py-4">Threat Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-indigo-300">#{tx.id.toString().padStart(4, '0')}</td>
                    <td className="px-4 py-3 text-slate-400">{new Date(tx.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-slate-200">${tx.amount?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-400">{tx.model_used}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border
                        ${tx.prediction === 'Normal' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'}`}>
                        {tx.prediction === 'Normal' ? 'Normal' : 'Anomaly'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${tx.risk_level === 'High Risk' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : tx.risk_level === 'Medium Risk' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></span>
                        <span className="font-medium text-slate-300">{tx.risk_score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
