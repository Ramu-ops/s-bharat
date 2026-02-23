
import React, { useState } from 'react';

interface EmployerLoginProps {
  onLogin: () => void;
}

const EmployerLogin: React.FC<EmployerLoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim().toLowerCase() === 'employer' && password === 'hire123') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setLoginSuccess(true);
        setTimeout(() => {
          onLogin();
        }, 1000);
      }, 1500);
    } else {
      alert("Invalid Credentials. Please use the credentials provided below.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-emerald-50">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Employer Hub</h2>
          <p className="text-sm text-gray-400 font-medium tracking-tight">Access talent verification terminal</p>
        </div>

        {loginSuccess ? (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">Session Initialized</p>
            <p className="text-xs text-gray-400 font-medium">Opening Terminal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mb-2">Business ID</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium text-gray-900 placeholder:text-gray-300"
                placeholder="employer"
                value={id}
                onChange={e => setId(e.target.value)}
              />
            </div>
            <div className="text-left">
              <label className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mb-2">Access Key</label>
              <input 
                type="password" 
                className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium text-gray-900 placeholder:text-gray-300"
                placeholder="hire123"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-medium text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Launch Terminal</span>
              )}
            </button>
          </form>
        )}
      </div>
      <div className="mt-8 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
        <p className="text-center text-[10px] text-emerald-600 uppercase tracking-widest font-semibold mb-1">Prototype Credentials</p>
        <p className="text-center text-xs text-emerald-400 font-medium">ID: <span className="font-semibold">employer</span> | Key: <span className="font-semibold">hire123</span></p>
      </div>
    </div>
  );
};

export default EmployerLogin;
