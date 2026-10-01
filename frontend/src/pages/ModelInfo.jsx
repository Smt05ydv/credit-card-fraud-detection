import React, { useEffect, useState } from 'react';
import { getModelMetrics } from '../api';
import { Server, Settings, Cpu, Activity, BarChart3, Network } from 'lucide-react';

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
    <div className="space-y-8 max-w-5xl animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3 mb-2">
          <Network className="text-indigo-400" />
          Neural Architectures
        </h2>
        <p className="text-slate-400 leading-relaxed max-w-3xl">
          The system employs multiple anomaly detection algorithms. Since fraud datasets are heavily imbalanced, 
          accuracy is misleading. <strong className="text-indigo-300 font-medium">PR-AUC</strong>, <strong className="text-indigo-300 font-medium">F1 Score</strong>, and <strong className="text-indigo-300 font-medium">Recall</strong> are the critical evaluation metrics.
        </p>
      </div>
      
      {loading ? (
        <div className="py-20 text-center text-slate-400 animate-pulse flex flex-col items-center gap-3">
          <Activity size={32} className="text-indigo-500/50" />
          <span>Synchronizing Models...</span>
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-1 gap-8">
          {Object.entries(metrics).map(([modelName, modelMetrics]) => (
            <div key={modelName} className="card group relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Cpu className="text-indigo-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 tracking-wide">{modelName}</h3>
                </div>
                <div className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">v2.0.4 - Active</div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8 relative z-10">
                <MetricBox label="PR-AUC" value={modelMetrics.pr_auc} highlight />
                <MetricBox label="F1 Score" value={modelMetrics.f1} highlight />
                <MetricBox label="Recall" value={modelMetrics.recall} highlight />
                <MetricBox label="Precision" value={modelMetrics.precision} />
                <MetricBox label="ROC-AUC" value={modelMetrics.roc_auc} />
                <MetricBox label="Accuracy" value={modelMetrics.accuracy} />
              </div>
              
              <div className="relative z-10">
                <h4 className="font-medium text-slate-300 mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-400"/> Confusion Matrix
                </h4>
                <div className="bg-slate-800/40 p-1 rounded-xl inline-block border border-slate-700/50 shadow-inner">
                  <table className="text-sm text-center border-collapse">
                    <tbody>
                      <tr>
                        <td className="p-3 text-slate-500 font-medium border-r border-b border-slate-700/50 bg-slate-900/40 rounded-tl-lg">True \ Pred</td>
                        <td className="p-3 font-semibold text-slate-300 border-b border-slate-700/50 w-28 bg-slate-900/20">Normal</td>
                        <td className="p-3 font-semibold text-slate-300 border-b border-slate-700/50 w-28 bg-slate-900/20 rounded-tr-lg">Anomaly</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-300 border-r border-slate-700/50 text-left bg-slate-900/20">Normal</td>
                        <td className="p-3 bg-emerald-500/10 text-emerald-400 font-mono shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]">{modelMetrics.confusion_matrix[0][0]} <span className="text-[10px] opacity-50 ml-1">TN</span></td>
                        <td className="p-3 bg-rose-500/5 text-rose-400/80 font-mono">{modelMetrics.confusion_matrix[0][1]} <span className="text-[10px] opacity-50 ml-1">FP</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-300 border-r border-slate-700/50 text-left bg-slate-900/20 rounded-bl-lg">Anomaly</td>
                        <td className="p-3 bg-rose-500/5 text-rose-400/80 font-mono">{modelMetrics.confusion_matrix[1][0]} <span className="text-[10px] opacity-50 ml-1">FN</span></td>
                        <td className="p-3 bg-emerald-500/10 text-emerald-400 font-mono shadow-[inset_0_0_10px_rgba(16,185,129,0.05)] rounded-br-lg">{modelMetrics.confusion_matrix[1][1]} <span className="text-[10px] opacity-50 ml-1">TP</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card border-rose-500/50 bg-rose-900/10 text-rose-400">Failed to load telemetry.</div>
      )}
    </div>
  );
}

function MetricBox({ label, value, highlight = false }) {
  return (
    <div className={`p-4 rounded-xl border flex flex-col justify-center items-center relative overflow-hidden group
      ${highlight 
        ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' 
        : 'bg-slate-800/40 border-slate-700/50'}`}>
      
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}
      
      <div className={`text-[10px] font-bold tracking-widest uppercase mb-1 relative z-10
        ${highlight ? 'text-indigo-400' : 'text-slate-500'}`}>{label}</div>
      
      <div className={`text-xl font-mono relative z-10
        ${highlight ? 'text-indigo-200' : 'text-slate-300'}`}>{value.toFixed(4)}</div>
    </div>
  );
}
