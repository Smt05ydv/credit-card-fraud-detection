import React from 'react';
import { Info, ShieldAlert, Code, Database, Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
        <Info className="text-indigo-400" />
        System Architecture
      </h2>
      
      <div className="card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700/50">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <ShieldAlert className="text-indigo-400" size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">FraudGuard AI</h3>
            <p className="text-slate-400 font-mono text-sm mt-1">v2.0.4 - Advanced Threat Detection</p>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
          <p>
            FraudGuard AI is an advanced anomaly detection system engineered to identify fraudulent credit card transactions in real-time. 
            Leveraging unsupervised machine learning, the system bypasses the limitations of traditional classification models on heavily imbalanced datasets.
          </p>
          
          <h4 className="text-lg font-semibold text-slate-200 mt-8 mb-4 flex items-center gap-2"><Cpu size={18} className="text-indigo-400"/> Primary Neural Engines</h4>
          <ul className="space-y-2 list-none pl-0">
            <li className="flex items-start gap-2 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
              <div>
                <strong className="text-indigo-300 block mb-1">Isolation Forest</strong>
                <span className="text-sm">Isolates anomalies by randomly selecting features and split values. Anomalies require fewer splits to be isolated.</span>
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
              <div>
                <strong className="text-indigo-300 block mb-1">Local Outlier Factor (LOF)</strong>
                <span className="text-sm">Computes the local density deviation of a data point with respect to its neighbors.</span>
              </div>
            </li>
            <li className="flex items-start gap-2 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
              <div>
                <strong className="text-indigo-300 block mb-1">One-Class SVM</strong>
                <span className="text-sm">Learns a decision boundary that encompasses normal data points in a high-dimensional space.</span>
              </div>
            </li>
          </ul>

          <h4 className="text-lg font-semibold text-slate-200 mt-8 mb-4 flex items-center gap-2"><Code size={18} className="text-indigo-400"/> Technical Stack</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-center">
              <span className="block font-bold text-slate-200">React</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Frontend</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-center">
              <span className="block font-bold text-slate-200">FastAPI</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Backend</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-center">
              <span className="block font-bold text-slate-200">Scikit-Learn</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">ML Engine</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-center">
              <span className="block font-bold text-slate-200">SQLite</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">Database</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200/80 text-sm">
            <strong className="text-amber-400 block mb-1">Disclaimer</strong>
            This system utilizes synthetic/anonymized PCA-transformed data for demonstration purposes. Risk scores and threat levels are calculated using custom heuristics mapping algorithm confidence metrics.
          </div>
        </div>
      </div>
    </div>
  );
}
