import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TransactionDetection from './pages/TransactionDetection';
import BatchCSVAnalysis from './pages/BatchCSVAnalysis';
import Analytics from './pages/Analytics';
import ModelInfo from './pages/ModelInfo';
import About from './pages/About';
import TransactionHistory from './pages/TransactionHistory';
import { getHealth } from './api';
import { ShieldCheck, ShieldAlert, LayoutDashboard, Search, FileSpreadsheet, BarChart2, Info, Server, List } from 'lucide-react';

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
      <div className="flex h-screen bg-transparent">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-700/50 text-slate-200 flex flex-col relative z-10 shadow-2xl">
          <div className="p-5 flex items-center gap-3 border-b border-slate-700/50">
            <div className="relative">
              <ShieldAlert className="text-indigo-400 relative z-10" size={32} />
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 rounded-full"></div>
            </div>
            <h1 className="font-bold text-xl leading-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">FraudGuard AI</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavItem to="/" icon={<LayoutDashboard size={20}/>} label="Dashboard" />
            <NavItem to="/detect" icon={<Search size={20}/>} label="Transaction Detection" />
            <NavItem to="/batch" icon={<FileSpreadsheet size={20}/>} label="Batch CSV Analysis" />
            <NavItem to="/history" icon={<List size={20}/>} label="History" />
            <NavItem to="/analytics" icon={<BarChart2 size={20}/>} label="Analytics" />
            <NavItem to="/model-info" icon={<Server size={20}/>} label="Model Info" />
            <NavItem to="/about" icon={<Info size={20}/>} label="About Project" />
          </nav>
          
          <div className="p-4 border-t border-slate-700/50 text-sm flex items-center justify-between bg-slate-900/40">
            <span className="text-slate-400">API Status:</span>
            <span className={`flex items-center gap-2 font-semibold ${backendStatus === 'Online' ? 'text-green-400 text-glow-green' : 'text-red-400 text-glow-red'}`}>
              <span className={`w-2 h-2 rounded-full ${backendStatus === 'Online' ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-400 shadow-[0_0_8px_#f87171]'}`}></span>
              {backendStatus}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Subtle background ambient light */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <header className="bg-slate-900/30 backdrop-blur-md p-5 border-b border-slate-800/50 flex justify-between items-center z-10 sticky top-0">
            <h2 className="text-xl font-semibold text-slate-100 tracking-wide">Credit Card Fraud Detection</h2>
            <div className="flex items-center gap-2 text-sm text-indigo-300 bg-indigo-950/50 border border-indigo-800/50 px-4 py-1.5 rounded-full shadow-inner">
              <ShieldCheck size={16} className="text-green-400 text-glow-green" />
              <span className="tracking-wide">Powered by Multi-Model AI</span>
            </div>
          </header>
          
          <main className="p-8 flex-1 overflow-auto z-0 relative">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/detect" element={<TransactionDetection />} />
              <Route path="/batch" element={<BatchCSVAnalysis />} />
              <Route path="/history" element={<TransactionHistory />} />
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
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group
        ${isActive 
          ? 'text-white bg-indigo-600/20 shadow-[inset_0_0_20px_rgba(79,70,229,0.2)] border border-indigo-500/30' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
        }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]"></div>
      )}
      <div className={`${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400 transition-colors'}`}>
        {icon}
      </div>
      <span className="font-medium tracking-wide">{label}</span>
    </Link>
  );
}

export default App;


