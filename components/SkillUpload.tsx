
import React, { useState } from 'react';
import { Skill } from '../types';

interface SkillUploadProps {
  onUpload: (skill: Skill) => void;
  onCancel: () => void;
}

const SkillUpload: React.FC<SkillUploadProps> = ({ onUpload, onCancel }) => {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'ipfs' | 'blockchain' | 'success'>('idle');

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer || !file) return alert("Fill all fields");

    setUploadState('ipfs');
    
    try {
      // Capture the file content immediately
      const evidenceUrl = await readFileAsDataURL(file);
      
      // Simulate IPFS Storage
      setTimeout(() => {
        setUploadState('blockchain');
        
        // Simulate Blockchain Transaction
        setTimeout(() => {
          const newSkill: Skill = {
            id: Math.random().toString(36).substr(2, 9),
            userId: 'u1',
            title,
            issuer,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            ipfsHash: 'Qm' + Math.random().toString(36).substr(2, 20),
            blockchainHash: '0x' + Math.random().toString(36).substr(2, 32),
            qrCode: 'VERIFY_' + Math.random().toString(36).substr(2, 6),
            evidenceUrl: evidenceUrl
          };
          onUpload(newSkill);
          setUploadState('success');
        }, 2000);
      }, 1500);
    } catch (err) {
      alert("Error reading file. Please try again.");
      setUploadState('idle');
    }
  };

  if (uploadState === 'success') {
    return (
      <div className="text-center py-20 animate-in zoom-in-95">
        <div className="w-24 h-24 bg-green-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-green-200">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-semibold mb-3 text-gray-900">Skill Logged Successfully</h2>
        <p className="text-gray-500 mb-10 font-medium max-w-sm mx-auto">Your certificate is now immutable on the blockchain and awaiting verification by the local board.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => {
              setUploadState('idle');
              setTitle('');
              setIssuer('');
              setFile(null);
            }}
            className="bg-indigo-50 text-indigo-700 px-10 py-4 rounded-2xl font-medium text-sm hover:bg-indigo-100 transition"
          >
            Upload Another
          </button>
          <button 
            onClick={onCancel}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-medium text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Log Service Credential</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-900 transition font-semibold text-sm flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          CANCEL
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Skill / Certification Name</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900"
              placeholder="e.g. Domestic Electrical License"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploadState !== 'idle'}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Issuing Organization / Local Body</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-gray-900"
              placeholder="e.g. State Electricity Board / Skill India"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              disabled={uploadState !== 'idle'}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Upload Certificate Image</label>
            <div className={`border-3 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer relative ${file ? 'border-green-400 bg-green-50' : 'border-slate-100 hover:border-indigo-300 bg-slate-50'}`}>
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                disabled={uploadState !== 'idle'}
              />
              <div className={file ? 'text-green-600' : 'text-slate-400'}>
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-4 bg-white rounded-xl shadow-sm border p-1 overflow-hidden">
                       <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-semibold text-sm uppercase tracking-wider">{file.name}</p>
                    <p className="text-[10px] mt-1">Click to change</p>
                  </div>
                ) : (
                  <>
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="font-semibold text-sm uppercase tracking-wider">Tap to upload your certificate</p>
                    <p className="text-xs font-medium mt-1">Photo of physical ID or digital PDF</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {uploadState === 'idle' ? (
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-semibold text-xl hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 active:scale-[0.98]"
            >
              Securely Upload to Ledger
            </button>
          ) : (
            <div className="space-y-6 bg-slate-50 p-6 rounded-[2rem]">
              <ProcessStep 
                label="Syncing with Decentralized Storage..." 
                active={uploadState === 'ipfs'} 
                done={uploadState === 'blockchain'} 
              />
              <ProcessStep 
                label="Registering Credential on Chain..." 
                active={uploadState === 'blockchain'} 
                done={false} 
              />
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className={`h-full bg-indigo-600 transition-all duration-1000 ${uploadState === 'ipfs' ? 'w-1/2' : 'w-full'}`} />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const ProcessStep: React.FC<{ label: string; active: boolean; done: boolean }> = ({ label, active, done }) => (
  <div className="flex items-center space-x-3">
    <div className={`w-4 h-4 rounded-full ${active ? 'bg-indigo-600 animate-ping' : done ? 'bg-green-500' : 'bg-slate-300'}`} />
    <span className={`text-sm font-semibold uppercase tracking-wider ${active ? 'text-indigo-900' : done ? 'text-green-600' : 'text-slate-400'}`}>{label}</span>
  </div>
);

export default SkillUpload;
