
import React, { useState } from 'react';
import { Skill, Transaction, Gig, ProblemReport, Review } from '../types';

interface EmployerPortalProps {
  allSkills: Skill[];
  transactions: Transaction[];
  employerBalance: number;
  setEmployerBalance: React.Dispatch<React.SetStateAction<number>>;
  gigs: Gig[];
  onPostGig: (gig: Gig) => void;
  onHireWorker: (gigId: string, workerId: string, finalBudget: number) => void;
  onAddReview: (gigId: string, review: Review, isWorkerReview: boolean) => void;
  problems?: ProblemReport[];
}

const EmployerPortal: React.FC<EmployerPortalProps> = ({ 
  allSkills, 
  transactions, 
  employerBalance, 
  setEmployerBalance, 
  gigs,
  onPostGig,
  onHireWorker,
  onAddReview,
  problems = []
}) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedGigForApplicants, setSelectedGigForApplicants] = useState<Gig | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [newGig, setNewGig] = useState({ 
    title: '', 
    desc: '', 
    location: '', 
    pay: '', 
    coords: null as { lat: number, lng: number } | null,
    paymentMethod: 'escrow' as 'escrow' | 'direct',
    payoutType: 'wallet' as 'wallet' | 'upi' | 'cash'
  });
  const [isPosting, setIsPosting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(topUpAmount);
    if (isNaN(amt) || amt <= 0) return alert("Enter valid amount");
    setEmployerBalance(prev => prev + amt);
    setShowTopUpModal(false);
    setTopUpAmount('');
    alert(`Successfully topped up ₹${amt}`);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // In a real app, we'd reverse geocode. For now, we'll use coords or a placeholder.
        setNewGig(prev => ({ 
          ...prev, 
          location: `Near Lat: ${pos.coords.latitude.toFixed(2)}, Lng: ${pos.coords.longitude.toFixed(2)}`,
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
        setIsLocating(false);
      },
      () => {
        alert("Unable to retrieve location");
        setIsLocating(false);
      }
    );
  };
  const handleReviewSubmit = (gigId: string) => {
    const review: Review = {
      id: `rev_e_${Math.random().toString(36).substr(2, 5)}`,
      fromId: 'employer',
      fromName: 'Employer',
      toId: 'worker', // In a real app, this would be the worker's ID
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };
    onAddReview(gigId, review, false);
    setShowReviewModal(null);
    setRating(5);
    setComment('');
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGig.title || !newGig.pay) return alert("Please fill title and payout");
    setIsPosting(true);
    setTimeout(() => {
      const gig: Gig = {
        id: Math.random().toString(36).substr(2, 9),
        title: newGig.title,
        description: newGig.desc,
        budget: `₹${newGig.pay}`,
        budgetNum: parseInt(newGig.pay),
        location: newGig.location || 'Local Area',
        coords: newGig.coords || undefined,
        requiredSkills: ['General Service'],
        postedBy: 'Business User',
        postedAt: 'Just Now',
        status: 'open',
        paymentMethod: newGig.paymentMethod,
        payoutType: newGig.payoutType
      };
      onPostGig(gig);
      setIsPosting(false);
      setShowPostModal(false);
      setNewGig({ title: '', desc: '', location: '', pay: '', coords: null, paymentMethod: 'escrow', payoutType: 'wallet' });
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">Employer Hub</h2>
          <p className="text-slate-500 font-medium">Post work and verify talent in your local area.</p>
        </div>
        <button 
          onClick={() => setShowPostModal(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-medium shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition"
        >
          Post New Work
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
           <h3 className="text-xl font-semibold text-slate-900 mb-6">Payment Escrow</h3>
           <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-normal text-slate-500 uppercase tracking-widest">Active Escrow Balance</p>
                <p className="text-3xl font-semibold text-slate-900">₹ {employerBalance.toLocaleString()}</p>
              </div>
              <button 
                onClick={() => setShowTopUpModal(true)}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                Top Up
              </button>
           </div>
           <p className="text-[10px] text-slate-400 italic">Funds are automatically released by Verifiers once work is approved.</p>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
           <h3 className="text-xl font-semibold text-slate-900 mb-6">Verification Insights</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                 <span className="text-sm font-medium text-slate-500">Local Workers Available</span>
                 <span className="font-semibold text-slate-900">2,481</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                 <span className="text-sm font-medium text-slate-500">Average Job Match</span>
                 <span className="font-semibold text-indigo-600">89%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
        <h3 className="text-2xl font-semibold text-slate-900 mb-8">Completed Work & Reviews</h3>
        <div className="space-y-6">
          {gigs.filter(g => g.status === 'completed').map(gig => (
            <div key={gig.id} className="p-8 bg-emerald-50/20 rounded-[2.5rem] border border-emerald-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-xl text-slate-900">{gig.title}</h4>
                  <p className="text-xs text-slate-500">Worker: {gig.workerId} • {gig.budget}</p>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">Completed</span>
              </div>

              {gig.employerReview ? (
                <div className="bg-white p-6 rounded-2xl border border-emerald-50 mt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Your Review of Worker</p>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < gig.employerReview!.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic">"{gig.employerReview.comment}"</p>
                </div>
              ) : (
                <button 
                  onClick={() => setShowReviewModal(gig.id)}
                  className="mt-4 text-emerald-600 font-bold text-xs uppercase tracking-widest hover:underline"
                >
                  + Rate Worker
                </button>
              )}

              {gig.workerReview && (
                <div className="bg-white p-6 rounded-2xl border border-emerald-50 mt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Worker's Review of You</p>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < gig.workerReview!.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic">"{gig.workerReview.comment}"</p>
                </div>
              )}
            </div>
          ))}
          {gigs.filter(g => g.status === 'completed').length === 0 && (
            <p className="text-center py-10 text-slate-400 italic">No completed jobs yet.</p>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Rate Worker</h3>
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <svg className={`w-10 h-10 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </button>
              ))}
            </div>
            <textarea 
              className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 h-32 mb-6"
              placeholder="Write your feedback about the worker..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="flex space-x-4">
              <button onClick={() => setShowReviewModal(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs">Cancel</button>
              <button onClick={() => handleReviewSubmit(showReviewModal)} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-emerald-100">Submit Review</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
        <h3 className="text-2xl font-semibold text-slate-900 mb-8">Your Active Gigs</h3>
        <div className="space-y-6">
          {gigs.filter(g => g.status === 'open').map(gig => (
            <div key={gig.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{gig.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{gig.location} • Budget: ₹{gig.budgetNum}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Applicants</p>
                  <p className="text-lg font-semibold text-indigo-600">{gig.applicants?.length || 0}</p>
                </div>
                <button 
                  onClick={() => setSelectedGigForApplicants(gig)}
                  className="bg-white px-6 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium text-xs hover:bg-slate-100 transition"
                >
                  Review Applicants
                </button>
              </div>
            </div>
          ))}
          {gigs.filter(g => g.status === 'open').length === 0 && (
            <p className="text-center py-10 text-slate-400 font-medium italic">No active gigs. Post one to find talent!</p>
          )}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
        <h3 className="text-2xl font-semibold text-slate-900 mb-8">Payout History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-[10px] font-normal text-slate-500 uppercase tracking-widest">Worker</th>
                <th className="pb-4 text-[10px] font-normal text-slate-500 uppercase tracking-widest">Job Type</th>
                <th className="pb-4 text-[10px] font-normal text-slate-500 uppercase tracking-widest">Payout</th>
                <th className="pb-4 text-[10px] font-normal text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter(tx => tx.type === 'Payment').map(tx => (
                <tr key={tx.id} className="border-b border-slate-50">
                  <td className="py-4 font-semibold text-sm text-slate-900">{tx.worker}</td>
                  <td className="py-4 text-sm font-medium text-slate-600">Completed Work</td>
                  <td className="py-4 font-semibold text-sm text-emerald-600">{tx.amount}</td>
                  <td className="py-4"><span className="bg-green-100 text-green-700 text-[9px] font-normal px-2 py-1 rounded-full">TRANSFERRED</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showTopUpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 relative shadow-2xl animate-in zoom-in-95">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Top Up Escrow</h3>
              <form onSubmit={handleTopUp} className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2 text-center">Amount to Add (₹)</label>
                   <input 
                    type="number" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl outline-none focus:border-emerald-500 font-semibold text-3xl text-center text-slate-900" 
                    placeholder="5000" 
                    value={topUpAmount} 
                    onChange={e => setTopUpAmount(e.target.value)} 
                    autoFocus
                   />
                 </div>
                 <div className="flex space-x-4">
                    <button type="button" onClick={() => setShowTopUpModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-medium">Cancel</button>
                    <button type="submit" className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-emerald-100">Add Funds</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl animate-in zoom-in-95">
              <h3 className="text-2xl font-semibold text-slate-900 mb-8">Post Local Job</h3>
              <form onSubmit={handlePost} className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2">Job Title</label>
                   <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 font-normal text-slate-900 placeholder:text-slate-400" 
                    placeholder="e.g. Clean & Rewire Shop" 
                    value={newGig.title} 
                    onChange={e => setNewGig({...newGig, title: e.target.value})} 
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest">Area / Location</label>
                        <button 
                          type="button" 
                          onClick={detectLocation}
                          className="text-[9px] font-normal text-indigo-600 uppercase tracking-widest hover:underline"
                        >
                          {isLocating ? 'Locating...' : 'Use My Location'}
                        </button>
                      </div>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 font-normal text-slate-900 placeholder:text-slate-400" 
                        placeholder="e.g. HSR Layout" 
                        value={newGig.location} 
                        onChange={e => setNewGig({...newGig, location: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2">Payout (₹)</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 font-normal text-slate-900 placeholder:text-slate-400" 
                        placeholder="e.g. 2500" 
                        value={newGig.pay} 
                        onChange={e => setNewGig({...newGig, pay: e.target.value})} 
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-4">Payment Configuration</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button 
                        type="button"
                        onClick={() => setNewGig({...newGig, paymentMethod: 'escrow'})}
                        className={`p-4 rounded-2xl border-2 transition-all text-left ${newGig.paymentMethod === 'escrow' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50'}`}
                      >
                        <p className="font-bold text-sm">Escrow (Safe)</p>
                        <p className="text-[10px] text-slate-500">Verified by SkillChain Node</p>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewGig({...newGig, paymentMethod: 'direct'})}
                        className={`p-4 rounded-2xl border-2 transition-all text-left ${newGig.paymentMethod === 'direct' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50'}`}
                      >
                        <p className="font-bold text-sm">Direct Pay</p>
                        <p className="text-[10px] text-slate-500">Bypass verification node</p>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['wallet', 'upi', 'cash'].map((type) => (
                        <button 
                          key={type}
                          type="button"
                          onClick={() => setNewGig({...newGig, payoutType: type as any})}
                          className={`py-3 rounded-xl border-2 transition-all text-xs font-bold uppercase tracking-widest ${newGig.payoutType === type ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                 <div>
                   <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2">Detailed Description</label>
                   <textarea 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-emerald-500 font-normal h-32 text-slate-900 placeholder:text-slate-400" 
                    placeholder="Describe the work requirements..." 
                    value={newGig.desc} 
                    onChange={e => setNewGig({...newGig, desc: e.target.value})} 
                   />
                 </div>
                 <div className="flex space-x-4">
                    <button type="button" onClick={() => setShowPostModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-medium">Cancel</button>
                    <button type="submit" disabled={isPosting} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-emerald-100">
                      {isPosting ? 'Processing...' : 'Confirm Post'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
      {/* Applicants Modal */}
      {selectedGigForApplicants && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">Review Applicants</h3>
                <p className="text-slate-500 text-sm">{selectedGigForApplicants.title}</p>
              </div>
              <button onClick={() => setSelectedGigForApplicants(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              {selectedGigForApplicants.applicants?.map(applicant => (
                <div key={applicant.workerId} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-semibold overflow-hidden">
                        {applicant.workerAvatar ? <img src={applicant.workerAvatar} className="w-full h-full object-cover" /> : applicant.workerName[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{applicant.workerName}</h4>
                        {applicant.workerPhone && (
                          <p className="text-[10px] text-indigo-600 font-medium flex items-center mt-0.5">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {applicant.workerPhone}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {applicant.skills.map(s => <span key={s} className="text-[8px] bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 uppercase">{s}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Proposed Payout</p>
                      <p className={`text-xl font-semibold ${applicant.proposedBudget < selectedGigForApplicants.budgetNum ? 'text-emerald-600' : 'text-slate-900'}`}>
                        ₹{applicant.proposedBudget}
                      </p>
                      {applicant.proposedBudget < selectedGigForApplicants.budgetNum && (
                        <p className="text-[9px] text-emerald-500 font-medium uppercase tracking-tighter">Lower than budget!</p>
                      )}
                    </div>
                  </div>
                  
                  {applicant.workerBio && (
                    <div className="mb-4">
                      <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mb-1">Worker Experience</p>
                      <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
                        {applicant.workerBio}
                      </p>
                    </div>
                  )}
                  
                  {applicant.message && (
                    <div className="mb-6">
                      <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest mb-1">Application Message</p>
                      <p className="text-sm text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 italic">
                        "{applicant.message}"
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      onHireWorker(selectedGigForApplicants.id, applicant.workerId, applicant.proposedBudget);
                      setSelectedGigForApplicants(null);
                    }}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium hover:bg-indigo-600 transition shadow-lg"
                  >
                    Hire for ₹{applicant.proposedBudget}
                  </button>
                </div>
              ))}
              {(!selectedGigForApplicants.applicants || selectedGigForApplicants.applicants.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-slate-400 font-medium italic">No applicants yet. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Promoted Problems Section */}
      {problems.filter(p => p.status === 'promoted').length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
            <span className="w-2 h-6 bg-amber-500 rounded-full mr-4" />
            Urgent Community Issues
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.filter(p => p.status === 'promoted').slice(0, 3).map(problem => (
              <div key={problem.id} className="bg-white p-8 rounded-[3rem] border-2 border-amber-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-slate-900">{problem.title}</h4>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold uppercase">{problem.votes} Votes</span>
                </div>
                <p className="text-xs text-slate-500 mb-6 line-clamp-2">{problem.description}</p>
                <button 
                  onClick={() => {
                    setNewGig({
                      title: `Solution: ${problem.title}`,
                      description: `Hire a worker to solve this community reported issue: ${problem.description}`,
                      budget: '₹5,000',
                      budgetNum: 5000,
                      requiredSkills: ['Problem Solving', 'Community Management'],
                      location: 'Remote / Local',
                      postedBy: 'GreenHome Solutions',
                      paymentMethod: 'escrow',
                      payoutType: 'wallet'
                    });
                    setShowPostModal(true);
                  }}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition"
                >
                  Create Gig to Solve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerPortal;
