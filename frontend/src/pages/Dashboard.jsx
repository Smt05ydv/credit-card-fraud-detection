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

  if (loading) return <div className="text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded">{error}</div>;
  if (!stats) return null;

  const pieData = [
    { name: 'Normal', value: stats.normal_transactions },
    { name: 'Anomaly', value: stats.detected_anomalies }
  ];
  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Transactions" value={stats.total_transactions} icon={<Activity size={24}/>} color="text-blue-500" />
        <StatCard title="Normal" value={stats.normal_transactions} icon={<CheckCircle size={24}/>} color="text-green-500" />
        <StatCard title="Anomalies" value={stats.detected_anomalies} icon={<ShieldAlert size={24}/>} color="text-red-500" />
        <StatCard title="High Risk" value={stats.high_risk_transactions} icon={<AlertTriangle size={24}/>} color="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Transaction Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div>Normal</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div>Anomaly</div>
          </div>
        </div>

        {/* Recent Predictions */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Recent Predictions (Sample)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_predictions.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2 font-medium text-gray-900">{p.id}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${p.status === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{p.risk_score}/100</td>
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

function StatCard({ title, value, icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-3 rounded-full bg-gray-50 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
