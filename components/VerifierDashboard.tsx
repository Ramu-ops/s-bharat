
import React, { useState } from 'react';
import { Skill, Gig, ProblemReport } from '../types';

interface VerifierDashboardProps {
  skills: Skill[];
  gigs: Gig[];
  problems: ProblemReport[];
  onVerifySkill: (id: string, status: 'verified' | 'rejected') => void;
  onVerifyWork: (id: string, approved: boolean, reason?: string) => void;
  onPromoteProblem: (id: string) => void;
}

const VerifierDashboard: React.FC<VerifierDashboardProps> = ({ skills, gigs, problems, onVerifySkill, onVerifyWork, onPromoteProblem }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'work' | 'problems'>('skills');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedWork, setSelectedWork] = useState<Gig | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  
  const pendingSkills = skills.filter(s => s.status === 'pending');
  const pendingWork = gigs.filter(g => g.status === 'submitted');

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Verification Node</h2>
          <p className="text-gray-500 font-medium">Protecting the local workforce ledger.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-fit">
           <button 
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-3 rounded-xl text-xs font-semibold transition-all ${activeTab === 'skills' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
           >
             CREDENTIALS
           </button>
           <button 
            onClick={() => setActiveTab('work')}
            className={`px-6 py-3 rounded-xl text-xs font-semibold transition-all ${activeTab === 'work' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
           >
             WORK SUBMISSIONS
           </button>
           <button 
            onClick={() => setActiveTab('problems')}
            className={`px-6 py-3 rounded-xl text-xs font-semibold transition-all ${activeTab === 'problems' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
           >
             COMMUNITY ISSUES
           </button>
        </div>
      </div>

      {activeTab === 'skills' ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-widest flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-3" />
            Skill Review Queue ({pendingSkills.length})
          </h3>
          {pendingSkills.map(skill => (
            <div key={skill.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-purple-200 transition-all">
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900">{skill.title}</h4>
                <p className="text-xs font-medium text-gray-400 uppercase">{skill.issuer}</p>
                <button onClick={() => setSelectedSkill(skill)} className="text-purple-600 font-semibold text-[10px] uppercase mt-2 hover:underline">Inspect Proof</button>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => onVerifySkill(skill.id, 'rejected')} className="px-6 py-3 rounded-xl text-xs font-semibold text-red-600 bg-red-50">Reject</button>
                <button onClick={() => onVerifySkill(skill.id, 'verified')} className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-purple-600 shadow-lg shadow-purple-100">Verify</button>
              </div>
            </div>
          ))}
          {pendingSkills.length === 0 && <p className="text-center py-20 text-gray-400 font-medium">No skills pending.</p>}
        </div>
      ) : activeTab === 'work' ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-widest flex items-center">
            <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3" />
            Work Verification Feed ({pendingWork.length})
          </h3>
          {pendingWork.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-200 transition-all">
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900">{job.title}</h4>
                <p className="text-xs font-medium text-indigo-600 uppercase">Payout: {job.budget} • Via {job.payoutType?.toUpperCase()}</p>
                <button onClick={() => setSelectedWork(job)} className="text-indigo-600 font-semibold text-[10px] uppercase mt-2 hover:underline">View Work Proof Photo</button>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setSelectedWork(job); setShowRejectionInput(true); }} className="px-6 py-3 rounded-xl text-xs font-semibold text-red-600 bg-red-50">Decline</button>
                <button onClick={() => onVerifyWork(job.id, true)} className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 shadow-lg shadow-indigo-100">Approve & Pay</button>
              </div>
            </div>
          ))}
          {pendingWork.length === 0 && <p className="text-center py-20 text-gray-400 font-medium">No work submissions pending.</p>}
        </div>
      ) : activeTab === 'problems' ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-widest flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-3" />
            Community Problem Queue ({problems.filter(p => p.status === 'pending').length})
          </h3>
          {problems.filter(p => p.status === 'pending').sort((a, b) => b.votes - a.votes).map(problem => (
            <div key={problem.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full">{problem.votes} VOTES</span>
                  <h4 className="font-semibold text-lg text-gray-900">{problem.title}</h4>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{problem.description}</p>
              </div>
              <button 
                onClick={() => onPromoteProblem(problem.id)}
                className="px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-white bg-amber-600 shadow-xl shadow-amber-100 hover:bg-amber-700 transition"
              >
                Promote to Employers
              </button>
            </div>
          ))}
          {problems.filter(p => p.status === 'pending').length === 0 && <p className="text-center py-20 text-gray-400 font-medium">No new problems reported.</p>}
        </div>
      ) : null}

      {/* MODAL FOR SKILL INSPECTION */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h4 className="font-semibold text-gray-900">Credential Inspection</h4>
                <button onClick={() => setSelectedSkill(null)} className="p-2 hover:bg-gray-200 rounded-full transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="p-10">
                <div className="w-full bg-slate-900 rounded-[2rem] overflow-hidden mb-8 border-4 border-slate-800">
                   {selectedSkill.evidenceUrl ? <img src={selectedSkill.evidenceUrl} className="w-full h-auto max-h-[50vh] object-contain mx-auto" alt="Proof" /> : <div className="p-20 text-center text-slate-500 font-normal uppercase text-xs">No Visual Evidence Provided</div>}
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => { onVerifySkill(selectedSkill.id, 'rejected'); setSelectedSkill(null); }} className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-medium">Reject Proof</button>
                  <button onClick={() => { onVerifySkill(selectedSkill.id, 'verified'); setSelectedSkill(null); }} className="flex-1 bg-purple-600 text-white py-4 rounded-2xl font-medium">Verify Credential</button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL FOR WORK INSPECTION */}
      {selectedWork && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h4 className="font-semibold text-gray-900">Work Submission Proof</h4>
                <button onClick={() => setSelectedWork(null)} className="p-2 hover:bg-gray-200 rounded-full transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="p-10">
                <p className="text-xs font-normal text-gray-400 uppercase mb-4">Worker Proof of Completion for: <span className="text-gray-900">{selectedWork.title}</span></p>
                <div className="w-full bg-slate-900 rounded-[2rem] overflow-hidden mb-8 border-4 border-slate-800 shadow-2xl">
                   {selectedWork.workProofUrl ? <img src={selectedWork.workProofUrl} className="w-full h-auto max-h-[50vh] object-contain mx-auto" alt="Work Proof" /> : <div className="p-20 text-center text-slate-500 font-normal uppercase text-xs">No Photo Proof Uploaded</div>}
                </div>
                
                {showRejectionInput ? (
                  <div className="space-y-4 animate-in slide-in-from-bottom-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Rejection Reason</label>
                      <textarea 
                        className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-red-500 h-24"
                        placeholder="Explain why the work was rejected..."
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button onClick={() => setShowRejectionInput(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-medium">Back</button>
                      <button 
                        onClick={() => { onVerifyWork(selectedWork.id, false, rejectionReason); setSelectedWork(null); setShowRejectionInput(false); setRejectionReason(''); }} 
                        className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-medium shadow-xl shadow-red-100"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <button onClick={() => setShowRejectionInput(true)} className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-medium">Decline Proof</button>
                    <button onClick={() => { onVerifyWork(selectedWork.id, true); setSelectedWork(null); }} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-medium shadow-xl shadow-indigo-100">Approve & Release ₹{selectedWork.budgetNum}</button>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-6">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg shadow-current/20`}>{count}</div>
    <div>
      <p className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{count}</p>
    </div>
  </div>
);

export default VerifierDashboard;
