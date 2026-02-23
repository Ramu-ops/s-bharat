
import React, { useState } from 'react';

interface VerifierLoginProps {
  onLogin: () => void;
}

const VerifierLogin: React.FC<VerifierLoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id.trim().toLowerCase() === 'admin' && password === 'verify123') {
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
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-purple-50">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-6">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Verifier Portal</h2>
          <p className="text-sm text-gray-400 font-medium tracking-tight">Access skill verification node #4821</p>
        </div>

        {loginSuccess ? (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">Access Granted</p>
            <p className="text-xs text-gray-400 font-medium">Redirecting to Dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label className="block text-[10px] font-semibold text-purple-600 uppercase tracking-widest mb-2">Verifier ID</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all font-medium text-gray-900 placeholder:text-gray-300"
                placeholder="admin"
                value={id}
                onChange={e => setId(e.target.value)}
              />
            </div>
            <div className="text-left">
              <label className="block text-[10px] font-semibold text-purple-600 uppercase tracking-widest mb-2">Access Key</label>
              <input 
                type="password" 
                className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all font-medium text-gray-900 placeholder:text-gray-300"
                placeholder="verify123"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-purple-600 text-white py-5 rounded-2xl font-medium text-lg hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Sign In to Node</span>
              )}
            </button>
          </form>
        )}
      </div>
      <div className="mt-8 bg-purple-50 p-4 rounded-2xl border border-purple-100">
        <p className="text-center text-[10px] text-purple-600 uppercase tracking-widest font-semibold mb-1">Prototype Credentials</p>
        <p className="text-center text-xs text-purple-400 font-medium">ID: <span className="font-semibold">admin</span> | Key: <span className="font-semibold">verify123</span></p>
      </div>
    </div>
  );
};

export default VerifierLogin;
