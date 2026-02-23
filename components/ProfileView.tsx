
import React, { useState } from 'react';
import { User, Skill, AppView, Gig, Review } from '../types';
import { translations } from '../locales';

interface ProfileViewProps {
  user: User;
  skills: Skill[];
  gigs: Gig[];
  completedGigs: Gig[];
  onSubmitWork: (id: string, proof: string) => void;
  setView: (view: AppView) => void;
  balance: number;
  setBalance: (val: number | ((prev: number) => number)) => void;
  onWithdraw: (amount: string) => void;
  onUpdateUser: (u: User) => void;
  onAddReview: (gigId: string, review: Review, isWorkerReview: boolean) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  skills, 
  gigs, 
  completedGigs, 
  onSubmitWork, 
  setView, 
  balance, 
  onWithdraw, 
  onUpdateUser,
  onAddReview
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentDetail, setPaymentDetail] = useState('');
  const [paymentType, setPaymentType] = useState<'upi' | 'bank'>('upi');
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount);
    if (isNaN(amt) || amt <= 0) return alert("Enter a valid amount");
    if (amt > balance) return alert("Insufficient balance");
    if (!paymentDetail) return alert(`Please enter your ${paymentType === 'upi' ? 'UPI ID' : 'Bank Account Details'}`);
    
    onWithdraw(withdrawAmount);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setPaymentDetail('');
  };

  const handleFileSubmission = async (gigId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => onSubmitWork(gigId, reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const activeJobs = gigs.filter(g => g.status === 'assigned' || g.status === 'submitted' || g.status === 'rejected');

  const handleReviewSubmit = (gigId: string) => {
    const review: Review = {
      id: `rev_${Math.random().toString(36).substr(2, 5)}`,
      fromId: user.phoneNumber || 'unknown',
      fromName: user.name,
      toId: 'employer', // In a real app, this would be the employer's ID
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };
    onAddReview(gigId, review, true);
    setShowReviewModal(null);
    setRating(5);
    setComment('');
  };
  const t = translations[user.language || 'en'] || translations['en'];

  return (
    <div className="space-y-10 pb-24">
      {/* Profile Header & Edit View */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 relative">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-8 right-10 text-indigo-600 font-semibold text-[10px] uppercase tracking-widest hover:underline"
        >
          {isEditing ? t.cancel : t.editProfile}
        </button>

        {isEditing ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
             <h2 className="text-2xl font-semibold text-slate-900 mb-6">{t.updateProfileInfo}</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2">{t.displayName}</label>
                   <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-slate-900 font-normal outline-none focus:border-indigo-500"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                   />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest">{t.serviceCity}</label>
                       <button 
                         type="button" 
                         onClick={() => {
                           if (navigator.geolocation) {
                             navigator.geolocation.getCurrentPosition((pos) => {
                               setEditedUser({
                                 ...editedUser, 
                                 location: { 
                                   city: `Current Location`, 
                                   lat: pos.coords.latitude, 
                                   lng: pos.coords.longitude 
                                 }
                               });
                             });
                           }
                         }}
                         className="text-[9px] font-normal text-indigo-600 uppercase tracking-widest hover:underline"
                       >
                         {t.detect}
                       </button>
                    </div>
                   <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-slate-900 font-normal outline-none focus:border-indigo-500"
                    value={editedUser.location?.city}
                    onChange={(e) => setEditedUser({...editedUser, location: { ...editedUser.location!, city: e.target.value }})}
                   />
                </div>
                <div className="md:col-span-2">
                   <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2">{t.professionalBio}</label>
                   <textarea 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-slate-900 font-normal outline-none focus:border-indigo-500 h-24"
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                   />
                </div>
             </div>
             <button 
              onClick={handleSaveProfile}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-medium shadow-lg hover:bg-indigo-700 transition"
             >
               {t.saveChanges}
             </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10">
            <div className="relative group">
              <img src={user.avatar} className="w-36 h-36 rounded-[3rem] object-cover ring-8 ring-indigo-50 shadow-2xl" alt="Profile" />
              <div className="absolute -bottom-3 -right-3 bg-green-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl font-semibold text-slate-900 tracking-tighter mb-2">{user.name}</h1>
              <p className="text-slate-600 font-medium mb-6 leading-relaxed max-w-lg">{user.bio || 'Professional worker in the SkillChain Bharat network.'}</p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <div className="bg-indigo-50 px-5 py-2.5 rounded-2xl text-[10px] font-normal text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                  UID: {user.phoneNumber}
                </div>
                <div className="bg-emerald-50 px-5 py-2.5 rounded-2xl text-[10px] font-normal text-emerald-700 border border-emerald-100 uppercase tracking-widest">
                  {user.location?.city || 'India'} Node
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
           </div>
           <h3 className="text-indigo-400 text-[10px] font-normal uppercase tracking-widest mb-2">{t.availableEarnings}</h3>
           <div className="text-5xl font-semibold mb-10 tracking-tighter">₹ {balance.toLocaleString()}</div>
           <button 
             onClick={() => setShowWithdrawModal(true)} 
             className="w-full bg-white text-slate-900 py-5 rounded-2xl font-medium text-sm shadow-xl hover:bg-indigo-50 active:scale-95 transition"
           >
             {t.withdrawToUpiBank}
           </button>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-xl flex flex-col justify-center">
           <h3 className="text-slate-600 text-[10px] font-normal uppercase tracking-widest mb-6">{t.credentialLocker}</h3>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <span className="text-[10px] font-normal text-slate-600 uppercase">{t.verified}</span>
                <p className="text-3xl font-semibold text-slate-900">{skills.filter(s => s.status === 'verified').length}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <span className="text-[10px] font-normal text-slate-600 uppercase">{t.pending}</span>
                <p className="text-3xl font-semibold text-slate-900">{skills.filter(s => s.status === 'pending').length}</p>
              </div>
           </div>
           <button 
            onClick={() => setView(AppView.SKILLS)}
            className="mt-6 w-full bg-indigo-50 text-indigo-600 py-4 rounded-2xl font-medium text-sm hover:bg-indigo-100 transition border border-indigo-100"
           >
             {t.addNewCertificate}
           </button>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl animate-in zoom-in-95">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">{t.withdrawEarnings}</h3>
              <form onSubmit={handleWithdrawSubmit} className="space-y-6">
                 <div>
                   <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2 text-center">{t.amountToWithdraw}</label>
                   <input 
                    type="number" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl outline-none focus:border-indigo-500 font-semibold text-3xl text-center text-slate-900" 
                    placeholder="0" 
                    value={withdrawAmount} 
                    onChange={e => setWithdrawAmount(e.target.value)} 
                    max={balance}
                    autoFocus
                   />
                   <p className="text-center mt-2 text-[10px] font-normal text-slate-400 uppercase tracking-widest">{t.available}: ₹{balance.toLocaleString()}</p>
                 </div>

                 <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setPaymentType('upi')}
                      className={`flex-1 py-3 rounded-xl font-medium text-xs transition-all ${paymentType === 'upi' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                    >
                      {t.upiId}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentType('bank')}
                      className={`flex-1 py-3 rounded-xl font-medium text-xs transition-all ${paymentType === 'bank' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                    >
                      {t.bankAccount}
                    </button>
                 </div>

                 <div>
                   <label className="block text-[10px] font-normal text-slate-700 uppercase tracking-widest mb-2">
                     {paymentType === 'upi' ? t.enterUpiId : t.bankAcIfsc}
                   </label>
                   <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500 font-normal text-slate-900" 
                    placeholder={paymentType === 'upi' ? 'worker@upi' : 'Account Number, IFSC Code'} 
                    value={paymentDetail} 
                    onChange={e => setPaymentDetail(e.target.value)} 
                   />
                 </div>

                 <div className="flex space-x-4">
                    <button type="button" onClick={() => setShowWithdrawModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-medium">{t.cancel}</button>
                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-indigo-100">{t.withdraw}</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Active Work Section */}
      <div className="bg-white p-10 rounded-[4rem] border-2 border-slate-100 shadow-xl">
        <h3 className="text-3xl font-semibold text-slate-900 mb-8 flex items-center">
          <span className="w-2 h-8 bg-indigo-600 rounded-full mr-5" />
          {t.activeAssignments}
        </h3>
        {activeJobs.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <p className="text-slate-500 font-normal uppercase tracking-widest">{t.noActiveAssignments}</p>
             <button onClick={() => setView(AppView.MARKETPLACE)} className="mt-4 text-indigo-600 font-normal text-sm uppercase underline">{t.browseJobs}</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {activeJobs.map(job => (
              <div key={job.id} className={`p-8 rounded-[3rem] border-2 flex flex-col sm:flex-row justify-between items-center gap-8 group transition-all ${job.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'}`}>
                 <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-normal text-2xl text-slate-900 mb-2">{job.title}</h4>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                       <span className="text-[9px] font-normal text-indigo-900 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200">{job.location}</span>
                       <span className="text-[9px] font-normal text-emerald-900 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">
                         {job.paymentMethod === 'escrow' ? t.verifiedPayout : 'Direct Payout'}
                       </span>
                       <span className="text-[9px] font-normal text-slate-900 uppercase tracking-widest bg-slate-200 px-3 py-1 rounded-lg border border-slate-300">
                         Via {job.payoutType?.toUpperCase() || 'WALLET'}
                       </span>
                    </div>
                    <p className="text-2xl font-semibold text-slate-900">{job.budget}</p>
                    {job.status === 'rejected' && (
                      <p className="mt-4 text-xs text-red-600 font-medium bg-white/50 p-4 rounded-xl border border-red-100">
                        <span className="font-bold uppercase block mb-1">Work Rejected</span>
                        {job.rejectionReason || "Work quality did not meet standards. You will not get paid for this submission."}
                      </p>
                    )}
                 </div>
                 <div className="w-full sm:w-auto">
                    {job.status === 'submitted' ? (
                      <div className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-normal text-[10px] uppercase tracking-widest flex items-center justify-center border-2 border-slate-800 shadow-2xl">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse" />
                        {t.verificationInProgress}
                      </div>
                    ) : job.status === 'rejected' ? (
                      <div className="bg-red-600 text-white px-8 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center border-2 border-red-400 shadow-xl">
                        Payment Blocked
                      </div>
                    ) : (
                      <label className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-medium text-sm cursor-pointer hover:bg-indigo-700 transition shadow-xl block text-center border-2 border-indigo-400">
                        {t.uploadProof}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFileSubmission(job.id, e.target.files[0])} />
                      </label>
                    )}
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Work & Reviews Section */}
      <div className="bg-white p-10 rounded-[4rem] border-2 border-slate-100 shadow-xl mt-12">
        <h3 className="text-3xl font-semibold text-slate-900 mb-8 flex items-center">
          <span className="w-2 h-8 bg-emerald-600 rounded-full mr-5" />
          Completed Work & Reviews
        </h3>
        {completedGigs.length === 0 ? (
          <p className="text-center py-10 text-slate-400 italic">No completed jobs yet.</p>
        ) : (
          <div className="grid gap-6">
            {completedGigs.map(job => (
              <div key={job.id} className="bg-emerald-50/30 p-8 rounded-[3rem] border-2 border-emerald-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-xl text-slate-900">{job.title}</h4>
                    <p className="text-xs text-slate-500">{job.location} • {job.budget}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">Completed</span>
                </div>
                
                {job.workerReview ? (
                  <div className="bg-white p-6 rounded-2xl border border-emerald-50 mt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Your Review of Employer</p>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < job.workerReview!.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 italic">"{job.workerReview.comment}"</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowReviewModal(job.id)}
                    className="mt-4 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline"
                  >
                    + Rate Employer
                  </button>
                )}

                {job.employerReview && (
                  <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 mt-4">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Employer's Review of You</p>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < job.employerReview!.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 italic">"{job.employerReview.comment}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Rate Employer</h3>
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <svg className={`w-10 h-10 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </button>
              ))}
            </div>
            <textarea 
              className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-indigo-500 h-32 mb-6"
              placeholder="Write your feedback about the employer..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="flex space-x-4">
              <button onClick={() => setShowReviewModal(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs">Cancel</button>
              <button onClick={() => handleReviewSubmit(showReviewModal)} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-indigo-100">Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
