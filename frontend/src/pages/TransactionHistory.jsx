import React, { useEffect, useState } from 'react';
import { getTransactions } from '../api';
import { Search, Filter } from 'lucide-react';

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
      
      <div className="card">
        <div className="flex gap-4 mb-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select 
            className="input-field py-1 px-2 text-sm w-auto" 
            value={filterRisk} 
            onChange={(e) => setFilterRisk(e.target.value)}
          >
            <option value="">All Risks</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Medium Risk">Medium Risk</option>
            <option value="High Risk">High Risk</option>
          </select>
          
          <select 
            className="input-field py-1 px-2 text-sm w-auto" 
            value={filterPred} 
            onChange={(e) => setFilterPred(e.target.value)}
          >
            <option value="">All Predictions</option>
            <option value="Normal">Normal</option>
            <option value="Potential Fraud / Anomaly">Anomaly</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500 py-8 text-center">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No transactions found in database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Timestamp</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Model</th>
                  <th className="px-4 py-2">Prediction</th>
                  <th className="px-4 py-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono">{tx.id}</td>
                    <td className="px-4 py-2">{new Date(tx.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2">${tx.amount?.toFixed(2)}</td>
                    <td className="px-4 py-2">{tx.model_used}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${tx.prediction === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tx.prediction}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium">{tx.risk_score} - {tx.risk_level}</td>
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
