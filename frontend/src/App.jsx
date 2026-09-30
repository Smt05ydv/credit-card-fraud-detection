import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TransactionDetection from './pages/TransactionDetection';
import BatchCSVAnalysis from './pages/BatchCSVAnalysis';
import Analytics from './pages/Analytics';
import ModelInfo from './pages/ModelInfo';
import About from './pages/About';
import { getHealth } from './api';
import { ShieldCheck, ShieldAlert, LayoutDashboard, Search, FileSpreadsheet, BarChart2, Info, Server } from 'lucide-react';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await getHealth();
      setBackendStatus(res.status === 'ok' ? 'Online' : 'Error');
    } catch (err) {
      setBackendStatus('Offline');
    }
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="p-4 flex items-center gap-3 border-b border-slate-800">
            <ShieldAlert className="text-blue-400" size={28} />
            <h1 className="font-bold text-lg leading-tight">FraudGuard AI</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <NavItem to="/" icon={<LayoutDashboard size={20}/>} label="Dashboard" />
            <NavItem to="/detect" icon={<Search size={20}/>} label="Transaction Detection" />
            <NavItem to="/batch" icon={<FileSpreadsheet size={20}/>} label="Batch CSV Analysis" />
            <NavItem to="/analytics" icon={<BarChart2 size={20}/>} label="Analytics" />
            <NavItem to="/model-info" icon={<Server size={20}/>} label="Model Info" />
            <NavItem to="/about" icon={<Info size={20}/>} label="About Project" />
          </nav>
          
          <div className="p-4 border-t border-slate-800 text-sm flex items-center justify-between">
            <span className="text-slate-400">API Status:</span>
            <span className={`font-semibold ${backendStatus === 'Online' ? 'text-green-400' : 'text-red-400'}`}>
              {backendStatus}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white p-4 shadow-sm flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Credit Card Fraud Detection</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <ShieldCheck size={16} className="text-green-500" />
              Powered by Isolation Forest
            </div>
          </header>
          
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/detect" element={<TransactionDetection />} />
              <Route path="/batch" element={<BatchCSVAnalysis />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/model-info" element={<ModelInfo />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-3 py-2 rounded text-slate-300 hover:bg-slate-800 hover:text-white transition">
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default App;
