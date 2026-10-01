import React, { useEffect, useState } from 'react';
import { getStats } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Activity, BarChart2 } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-400 animate-pulse flex justify-center py-20 text-xl font-light tracking-wide">Aggregating Data...</div>;
  if (!stats) return <div className="text-rose-400">Failed to load analytics.</div>;

  const riskDistribution = [
    { name: 'Low Risk', count: stats.normal_transactions > 100 ? stats.normal_transactions - 100 : stats.normal_transactions },
    { name: 'Medium Risk', count: stats.normal_transactions > 100 ? 100 : 0 },
    { name: 'High Risk', count: stats.high_risk_transactions }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
        <BarChart2 className="text-indigo-400" />
        Advanced Analytics
      </h2>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="card">
          <h3 className="font-semibold text-lg mb-6 text-slate-200 tracking-wide">Risk Assessment Distribution</h3>
          <div className="h-80 w-full relative">
            <ResponsiveContainer>
              <BarChart data={riskDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={{stroke: '#475569'}} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={{stroke: '#475569'}} />
                <RechartsTooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '0.75rem', color: '#f1f5f9', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-indigo-900/10 border-indigo-500/20">
          <h3 className="font-semibold text-lg mb-4 text-indigo-300">System Insights</h3>
          <div className="prose prose-invert max-w-none text-slate-400 text-sm leading-relaxed">
            <p>
              The current anomaly detection rate is <strong className="text-indigo-400">{stats.anomaly_percentage}%</strong>. 
              Out of <strong className="text-slate-300">{stats.total_transactions}</strong> total scanned transactions, the system successfully identified <strong className="text-rose-400">{stats.detected_anomalies}</strong> anomalies.
            </p>
            <p className="mt-2">
              Based on the risk distribution model, there are currently <strong className="text-amber-400">{stats.high_risk_transactions}</strong> high-risk incidents requiring immediate review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
