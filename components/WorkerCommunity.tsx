
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProblemReport, User, UserRole } from '../types';
import { translations } from '../locales';

interface WorkerCommunityProps {
  user: User;
  problems: ProblemReport[];
  onReportProblem: (problem: Omit<ProblemReport, 'id' | 'votes' | 'status' | 'date'>) => void;
  onVote: (id: string) => void;
}

const WorkerCommunity: React.FC<WorkerCommunityProps> = ({ user, problems, onReportProblem, onVote }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [newProblem, setNewProblem] = useState({ title: '', description: '' });
  const lang = user.language || 'en';
  const t = translations[lang] || translations['en'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReportProblem({
      workerId: user.phoneNumber || 'unknown',
      workerName: user.name,
      language: lang,
      title: newProblem.title,
      description: newProblem.description
    });
    setNewProblem({ title: '', description: '' });
    setShowReportModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-semibold text-slate-900 tracking-tighter">Community Board</h2>
          <p className="text-slate-500 mt-2">Share problems and vote on issues to improve SkillChain Bharat.</p>
        </div>
        <button 
          onClick={() => setShowReportModal(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-medium shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
        >
          Report Problem
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {problems.sort((a, b) => b.votes - a.votes).map((problem) => (
          <motion.div 
            layout
            key={problem.id}
            className={`bg-white p-8 rounded-[3rem] border-2 transition-all ${problem.status === 'promoted' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg">{problem.title}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">By {problem.workerName} • {problem.date}</p>
                </div>
              </div>
              {problem.status === 'promoted' && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-amber-200">
                  Promoted to Employers
                </span>
              )}
            </div>

            <p className="text-slate-600 leading-relaxed mb-8 bg-white/50 p-6 rounded-2xl border border-slate-50">
              {problem.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => onVote(problem.id)}
                  className="flex items-center space-x-2 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  <span className="font-bold">{problem.votes} Votes</span>
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Language: {problem.language.toUpperCase()}</span>
              </div>
              
              {problem.status === 'promoted' && user.role !== UserRole.GIG_WORKER && (
                <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition">
                  Hire to Solve
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[400] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl"
            >
              <h3 className="text-3xl font-semibold text-slate-900 mb-8 tracking-tighter">Report a Problem</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Problem Title</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500"
                    placeholder="e.g. Payment Delay in Peenya Area"
                    value={newProblem.title}
                    onChange={e => setNewProblem({...newProblem, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Description</label>
                  <textarea 
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500 h-32"
                    placeholder="Describe the issue in your native language..."
                    value={newProblem.description}
                    onChange={e => setNewProblem({...newProblem, description: e.target.value})}
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-indigo-100"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkerCommunity;
