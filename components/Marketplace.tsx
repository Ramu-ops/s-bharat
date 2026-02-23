
import React, { useState, useEffect, useMemo } from 'react';
import { Skill, Gig, User, MatchingResult } from '../types';
import { getSkillMatches } from '../geminiService';
import { translations } from '../locales';

interface MarketplaceProps {
  user: User;
  userSkills: Skill[];
  gigs: Gig[];
  onAccept: (gigId: string, proposedBudget: number, message: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ user, userSkills, gigs, onAccept }) => {
  const [selectedGigForApply, setSelectedGigForApply] = useState<Gig | null>(null);
  const [proposedBudget, setProposedBudget] = useState<number>(0);
  const [applyMessage, setApplyMessage] = useState('');
  const [matches, setMatches] = useState<MatchingResult[]>([]);

  const handleApplyClick = (gig: Gig) => {
    setSelectedGigForApply(gig);
    setProposedBudget(gig.budgetNum);
    setApplyMessage('');
  };

  const submitApplication = () => {
    if (selectedGigForApply) {
      onAccept(selectedGigForApply.id, proposedBudget, applyMessage);
      setSelectedGigForApply(null);
    }
  };
  const [radius, setRadius] = useState(user.workRadius || 25);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minPay, setMinPay] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[user.language || 'en'] || translations['en'];

  // Extract all unique skills from available gigs for the filter
  const allAvailableSkills = useMemo(() => {
    const skillSet = new Set<string>();
    gigs.forEach(g => g.requiredSkills.forEach(s => skillSet.add(s)));
    return Array.from(skillSet);
  }, [gigs]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (userSkills.length === 0) return;
      setIsLoading(true);
      const results = await getSkillMatches(userSkills, gigs);
      setMatches(results);
      setIsLoading(false);
    };
    fetchMatches();
  }, [userSkills, gigs]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filteredGigs = gigs.filter(g => {
    if (g.status !== 'open') return false;
    
    // Search Query (Title or Description)
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         g.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Skill Filter
    const matchesSkills = selectedSkills.length === 0 || 
                         g.requiredSkills.some(s => selectedSkills.includes(s));
    
    // Pay Filter
    const matchesPay = g.budgetNum >= minPay;

    // Simulated Radius Filter (Simple city match or distance simulation)
    let matchesRadius = true;
    if (searchQuery) {
      matchesRadius = g.location.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (user.location && g.coords) {
      // Very rough distance approximation for prototype
      const dist = Math.sqrt(
        Math.pow(user.location.lat - g.coords.lat, 2) + 
        Math.pow(user.location.lng - g.coords.lng, 2)
      ) * 111; // 1 degree ~ 111km
      matchesRadius = dist <= radius;
    }

    return matchesSearch && matchesSkills && matchesPay && matchesRadius;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <header>
        <h2 className="text-4xl font-semibold text-slate-900 tracking-tighter mb-2">{t.gigMarketplace}</h2>
        <p className="text-slate-500 font-medium">{t.marketplaceSubtitle}</p>
      </header>

      {/* Advanced Filter Panel */}
      <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-xl space-y-8">
        {/* Row 1: Search */}
        <div className="flex bg-slate-50 p-2 rounded-2xl border-2 border-slate-200 group focus-within:border-indigo-500 transition-all">
          <div className="pl-4 pr-2 flex items-center text-slate-400 group-focus-within:text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text"
            placeholder={t.searchPlaceholder}
            className="flex-1 p-4 bg-transparent text-slate-900 font-normal text-lg outline-none placeholder:text-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Row 2: Range Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-normal uppercase text-slate-400 tracking-widest">{t.minPayout} (₹{minPay})</label>
            </div>
            <input 
              type="range" min="0" max="50000" step="500"
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={minPay}
              onChange={(e) => setMinPay(parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-normal uppercase text-slate-400 tracking-widest">{t.serviceRadius} ({radius} KM)</label>
            </div>
            <input 
              type="range" min="1" max="100" 
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Row 3: Skill Chips */}
        <div className="space-y-4">
          <label className="text-[10px] font-normal uppercase text-slate-400 tracking-widest">{t.filterBySkills}</label>
          <div className="flex flex-wrap gap-2">
            {allAvailableSkills.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border-2 ${
                  selectedSkills.includes(skill)
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-300'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gig List */}
      <div className="grid gap-6">
        {isLoading && (
          <div className="py-20 text-center bg-white rounded-[3rem] shadow-xl animate-pulse">
            <p className="font-normal text-slate-400 uppercase tracking-widest text-xs">{t.matchingSkillsAi}</p>
          </div>
        )}

        {!isLoading && filteredGigs.length === 0 ? (
          <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center shadow-lg">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-slate-400 font-normal uppercase tracking-widest text-xs">{t.noGigsFound}</p>
            <button onClick={() => { setSelectedSkills([]); setMinPay(0); setSearchQuery(''); }} className="mt-4 text-indigo-600 font-normal text-sm uppercase underline">{t.clearAllFilters}</button>
          </div>
        ) : (
          !isLoading && filteredGigs.map(gig => {
            const match = matches.find(m => m.gigId === gig.id);
            return (
              <div key={gig.id} className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-xl hover:shadow-2xl hover:border-indigo-400 transition-all group overflow-hidden relative">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-normal px-4 py-1.5 rounded-full uppercase border border-emerald-200">{t.openTask}</span>
                      {match && <span className="bg-indigo-900 text-white text-[10px] font-normal px-4 py-1.5 rounded-full shadow-lg">{match.matchScore}% Match</span>}
                    </div>
                    <h3 className="text-3xl font-semibold text-slate-900 mb-2 leading-tight tracking-tight">{gig.title}</h3>
                    <div className="flex items-center text-slate-900 font-semibold text-xl mb-6">
                      <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl mr-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      </div>
                      {gig.location} <span className="mx-3 text-slate-200">|</span> <span className="text-indigo-600">{gig.budget}</span>
                    </div>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8 max-w-2xl">{gig.description}</p>
                    <div className="flex flex-wrap gap-2">
                       {gig.requiredSkills.map(s => <span key={s} className="bg-slate-50 text-slate-800 text-[10px] font-normal px-4 py-2 rounded-xl border border-slate-200 uppercase tracking-widest">{s}</span>)}
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <button 
                      onClick={() => handleApplyClick(gig)}
                      className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-medium text-lg hover:bg-indigo-700 transition-all shadow-xl active:scale-95 group-hover:scale-105"
                    >
                      {t.acceptGig}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Application Modal */}
      {selectedGigForApply && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Apply for Gig</h3>
            <p className="text-slate-500 text-sm mb-6">{selectedGigForApply.title}</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2">Your Proposed Payout (₹)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500 font-semibold text-2xl text-slate-900" 
                  value={proposedBudget} 
                  onChange={e => setProposedBudget(parseInt(e.target.value) || 0)} 
                />
                <p className="text-[10px] text-slate-400 mt-2 italic">Original Budget: ₹{selectedGigForApply.budgetNum}</p>
              </div>

              <div>
                <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2">Message to Employer</label>
                <textarea 
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500 font-normal h-24 text-slate-900 placeholder:text-slate-400" 
                  placeholder="Why are you a good fit?" 
                  value={applyMessage} 
                  onChange={e => setApplyMessage(e.target.value)} 
                />
              </div>

              <div className="flex space-x-4">
                <button onClick={() => setSelectedGigForApply(null)} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-medium">Cancel</button>
                <button onClick={submitApplication} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-indigo-100">Send Application</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
