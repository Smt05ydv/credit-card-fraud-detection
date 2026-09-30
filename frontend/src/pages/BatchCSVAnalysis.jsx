import React, { useState } from 'react';
import { predictBatch } from '../api';
import { Upload, FileSpreadsheet, Download, AlertCircle } from 'lucide-react';

export default function BatchCSVAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

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
      const data = await predictBatch(file);
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during CSV processing.');
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!results || !results.results) return;
    
    const headers = ["row_index", "prediction", "is_anomaly", "anomaly_score", "risk_score", "risk_level"];
    const csvContent = [
      headers.join(","),
      ...results.results.map(r => headers.map(h => r[h]).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "fraud_detection_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Batch CSV Analysis</h2>
      
      <div className="card max-w-2xl">
        <p className="text-gray-600 mb-4">
          Upload a CSV file containing transaction data. Required columns: <code>Time</code>, <code>V1</code> to <code>V28</code>, and <code>Amount</code>.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
          <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          {file ? (
            <p className="font-medium text-blue-600">{file.name}</p>
          ) : (
            <p className="text-gray-500">Click or drag CSV file here to upload</p>
          )}
        </div>
        
        <button onClick={handleUpload} disabled={!file || loading} className="btn w-full mt-4 flex justify-center gap-2">
          {loading ? 'Processing...' : 'Analyze File'} <FileSpreadsheet size={18} />
        </button>
        
        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded flex items-start gap-2"><AlertCircle size={20} className="shrink-0 mt-0.5"/> <span>{error}</span></div>}
      </div>

      {results && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Analysis Results</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatBox label="Total Rows" value={results.summary.total_rows} />
            <StatBox label="Normal" value={results.summary.normal_count} color="text-green-600" />
            <StatBox label="Anomalies" value={results.summary.anomaly_count} color="text-red-600" />
            <StatBox label="Anomaly %" value={`${results.summary.anomaly_percentage}%`} />
            <StatBox label="High Risk" value={results.summary.high_risk_count} color="text-orange-600" />
          </div>
          
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Prediction Table (First 100 rows)</h4>
              <button onClick={downloadResults} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                <Download size={16}/> Download Full Results CSV
              </button>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">Row</th>
                    <th className="px-4 py-2">Prediction</th>
                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {results.results.slice(0, 100).map((r, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{r.row_index}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${r.is_anomaly ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {r.prediction}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono">{r.anomaly_score}</td>
                      <td className="px-4 py-2">{r.risk_score} - {r.risk_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color = "text-gray-900" }) {
  return (
    <div className="bg-white border rounded p-3 text-center shadow-sm">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}
