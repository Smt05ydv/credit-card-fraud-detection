import React, { useEffect, useState } from 'react';
import { getStats } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!stats) return <div className="text-red-500">Failed to load analytics data.</div>;

  // Mocking more detailed distribution data based on stats for visualization
  const riskDistribution = [
    { name: 'Low Risk (0-39)', count: stats.normal_transactions - 100 },
    { name: 'Medium Risk (40-69)', count: 100 },
    { name: 'High Risk (70-100)', count: stats.high_risk_transactions }
  ];

  const scoreDistribution = [
    { range: '< -0.2 (High Anomaly)', count: 15 },
    { range: '-0.2 to -0.1', count: 35 },
    { range: '-0.1 to 0', count: 100 },
    { range: '0 to 0.1', count: 1500 },
    { range: '> 0.1 (Normal)', count: stats.normal_transactions - 1600 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Advanced Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Risk Level Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Anomaly Score Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}
