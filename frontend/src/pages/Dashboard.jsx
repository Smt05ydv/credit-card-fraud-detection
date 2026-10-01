import React, { useEffect, useState } from 'react';
import { getStats } from '../api';
import { Activity, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError('Could not load dashboard statistics. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-slate-400 animate-pulse flex justify-center py-20 text-xl font-light tracking-wide">Initializing Core Systems...</div>;
  if (error) return <div className="text-red-400 bg-red-900/20 p-5 rounded-xl border border-red-500/30 flex items-center gap-3 backdrop-blur-sm shadow-[0_0_20px_rgba(239,68,68,0.15)]"><AlertTriangle /> {error}</div>;
  if (!stats) return null;

  const pieData = [
    { name: 'Normal', value: stats.normal_transactions },
    { name: 'Anomaly', value: stats.detected_anomalies }
  ];
  // Neon colors for dark theme
  const COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">System Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Scans" value={stats.total_transactions} icon={<Activity size={28}/>} color="text-indigo-400" bgColor="bg-indigo-500/10" shadow="shadow-[0_0_15px_rgba(99,102,241,0.2)]" />
        <StatCard title="Normal" value={stats.normal_transactions} icon={<CheckCircle size={28}/>} color="text-emerald-400" bgColor="bg-emerald-500/10" shadow="shadow-[0_0_15px_rgba(16,185,129,0.2)]" />
        <StatCard title="Anomalies" value={stats.detected_anomalies} icon={<ShieldAlert size={28}/>} color="text-rose-400" bgColor="bg-rose-500/10" shadow="shadow-[0_0_15px_rgba(244,63,94,0.2)]" />
        <StatCard title="High Risk" value={stats.high_risk_transactions} icon={<AlertTriangle size={28}/>} color="text-amber-400" bgColor="bg-amber-500/10" shadow="shadow-[0_0_15px_rgba(245,158,11,0.2)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-6 text-slate-200 tracking-wide">Transaction Distribution</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" cy="50%" 
                  innerRadius={70} 
                  outerRadius={90} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}80)` }} 
                    />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '0.75rem', color: '#f1f5f9', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center glowing element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-900/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-slate-700/30 flex items-center justify-center">
              <Activity className="text-slate-400 opacity-50" size={24} />
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-slate-300"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>Normal</div>
            <div className="flex items-center gap-2 text-slate-300"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>Anomaly</div>
          </div>
        </div>

        {/* Recent Predictions */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-6 text-slate-200 tracking-wide flex items-center justify-between">
            Recent Interceptions
            <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 shadow-inner">Live Feed</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700/50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {stats.recent_predictions.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-300">{p.id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border
                        ${p.prediction === 'Normal' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'}`}>
                        {p.prediction}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden max-w-[60px]">
                          <div className={`h-1.5 rounded-full ${p.risk_score > 70 ? 'bg-rose-500' : p.risk_score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${p.risk_score}%` }}></div>
                        </div>
                        <span className="text-slate-400 font-mono">{p.risk_score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor, shadow }) {
  return (
    <div className="card flex items-center gap-5 overflow-hidden group">
      {/* Background gradient flare effect on hover */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${bgColor} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
      
      <div className={`p-4 rounded-xl ${bgColor} ${color} ${shadow} ring-1 ring-white/5`}>
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">{title}</p>
        <p className="text-3xl font-bold text-slate-100 mt-1 drop-shadow-md">{value}</p>
      </div>
    </div>
  );
}
