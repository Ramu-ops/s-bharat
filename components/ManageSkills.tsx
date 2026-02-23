
import React from 'react';
import { Skill, AppView } from '../types';

interface ManageSkillsProps {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  setView: (view: AppView) => void;
}

const ManageSkills: React.FC<ManageSkillsProps> = ({ skills, setSkills, setView }) => {
  const handleDelete = (id: string) => {
    if (window.confirm("Delete this skill from your decentralized ID?")) {
      setSkills(skills.filter(s => s.id !== id));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => setView(AppView.PROFILE)} className="text-indigo-600 font-semibold text-sm flex items-center mb-2 hover:underline">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            Back to Profile
          </button>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Your Skill Inventory</h2>
        </div>
        <button 
          onClick={() => setView(AppView.SKILLS)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-medium text-sm shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-transform"
        >
          Add New Skill
        </button>
      </div>

      <div className="grid gap-4">
        {skills.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-inner">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No skills found in locker</p>
          </div>
        ) : (
          skills.map(skill => (
            <div key={skill.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
              <div className="flex items-center space-x-6">
                <div className={`p-4 rounded-2xl shadow-sm ${
                  skill.status === 'verified' ? 'bg-green-50 text-green-600' : 
                  skill.status === 'pending' ? 'bg-orange-50 text-orange-600' : 
                  'bg-red-50 text-red-600'
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{skill.title}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-normal uppercase tracking-widest text-gray-400">{skill.issuer}</span>
                    <span className={`text-[10px] font-normal uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      skill.status === 'verified' ? 'bg-green-100 text-green-700' : 
                      skill.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {skill.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-3 bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-xl transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button 
                  onClick={() => handleDelete(skill.id)}
                  className="p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageSkills;
