
import React, { useState, useEffect } from 'react';
import { AppView, User, Skill, Gig, UserRole, Transaction, Applicant, ProblemReport, Review } from './types';
import { INITIAL_USER, MOCK_SKILLS, MOCK_GIGS, MOCK_VERIFIER, MOCK_PROBLEMS } from './constants';
import Onboarding from './components/Onboarding';
import ProfileView from './components/ProfileView';
import SkillUpload from './components/SkillUpload';
import VerifierDashboard from './components/VerifierDashboard';
import VerifierLogin from './components/VerifierLogin';
import EmployerLogin from './components/EmployerLogin';
import Marketplace from './components/Marketplace';
import EmployerPortal from './components/EmployerPortal';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import ManageSkills from './components/ManageSkills';
import AiAssistant from './components/AiAssistant';
import AppTour from './components/AppTour';
import WorkerCommunity from './components/WorkerCommunity';

const App: React.FC = () => {
  // Persistence Simulation
  const getStoredUsers = (): Record<string, User> => {
    const data = localStorage.getItem('skillchain_users');
    return data ? JSON.parse(data) : {};
  };

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const activeId = sessionStorage.getItem('active_user_id');
    const users = getStoredUsers();
    return activeId && users[activeId] ? users[activeId] : { ...INITIAL_USER, walletAddress: undefined, isKycVerified: false };
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    return currentUser.walletAddress ? AppView.PROFILE : AppView.ONBOARDING;
  });

  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS);
  const [balance, setBalance] = useState(0);
  const [employerBalance, setEmployerBalance] = useState(() => {
    const data = localStorage.getItem('employer_balance');
    return data ? parseInt(data) : 85000;
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isVerifierAuthenticated, setIsVerifierAuthenticated] = useState(false);
  const [isEmployerAuthenticated, setIsEmployerAuthenticated] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [problems, setProblems] = useState<ProblemReport[]>(() => {
    const data = localStorage.getItem('skillchain_problems');
    return data ? JSON.parse(data) : MOCK_PROBLEMS;
  });
  
  // Persist Gigs
  const [gigs, setGigs] = useState<Gig[]>(() => {
    const data = localStorage.getItem('skillchain_gigs');
    return data ? JSON.parse(data) : MOCK_GIGS;
  });

  // Load user-specific data when user changes
  useEffect(() => {
    if (currentUser.phoneNumber) {
      const savedSkills = localStorage.getItem(`skills_${currentUser.phoneNumber}`);
      if (savedSkills) setSkills(JSON.parse(savedSkills));
      else setSkills(MOCK_SKILLS);

      const savedBalance = localStorage.getItem(`balance_${currentUser.phoneNumber}`);
      setBalance(savedBalance ? parseInt(savedBalance) : 0);

      const savedTransactions = localStorage.getItem(`transactions_${currentUser.phoneNumber}`);
      setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
    } else {
      setSkills(MOCK_SKILLS);
      setBalance(0);
      setTransactions([]);
    }
  }, [currentUser.phoneNumber]);

  useEffect(() => {
    const lang = currentUser.language || 'en';
    // Remove all previous language classes
    const langClasses = ['lang-en', 'lang-hi', 'lang-bn', 'lang-te', 'lang-mr', 'lang-ta', 'lang-gu', 'lang-kn'];
    document.body.classList.remove(...langClasses);
    // Add current language class
    document.body.classList.add(`lang-${lang}`);
  }, [currentUser.language]);

  // Sync state to storage
  useEffect(() => {
    if (currentUser.phoneNumber) {
      const users = getStoredUsers();
      users[currentUser.phoneNumber] = currentUser;
      localStorage.setItem('skillchain_users', JSON.stringify(users));
      sessionStorage.setItem('active_user_id', currentUser.phoneNumber);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser.phoneNumber) {
      localStorage.setItem(`skills_${currentUser.phoneNumber}`, JSON.stringify(skills));
    }
  }, [skills, currentUser.phoneNumber]);

  useEffect(() => {
    if (currentUser.phoneNumber) {
      localStorage.setItem(`balance_${currentUser.phoneNumber}`, balance.toString());
    }
  }, [balance, currentUser.phoneNumber]);

  useEffect(() => {
    if (currentUser.phoneNumber) {
      localStorage.setItem(`transactions_${currentUser.phoneNumber}`, JSON.stringify(transactions));
    }
  }, [transactions, currentUser.phoneNumber]);

  useEffect(() => {
    localStorage.setItem('skillchain_gigs', JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem('skillchain_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('employer_balance', employerBalance.toString());
  }, [employerBalance]);

  useEffect(() => {
    const lang = currentUser.language || 'en';
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
  }, [currentUser.language]);

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role,
      name: role === UserRole.VERIFIER ? MOCK_VERIFIER.name : prev.name || INITIAL_USER.name,
      avatar: role === UserRole.VERIFIER ? MOCK_VERIFIER.avatar : prev.avatar || INITIAL_USER.avatar
    }));

    if (role === UserRole.VERIFIER) {
      if (isVerifierAuthenticated) setCurrentView(AppView.VERIFICATION);
      else setCurrentView(AppView.VERIFIER_LOGIN);
    } else if (role === UserRole.EMPLOYER) {
      if (isEmployerAuthenticated) setCurrentView(AppView.EMPLOYER);
      else setCurrentView(AppView.EMPLOYER_LOGIN);
    } else {
      setCurrentView(AppView.PROFILE);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView(AppView.PROFILE);
    // Check if it's a new user (no wallet address previously)
    if (!currentUser.walletAddress) {
      setShowTour(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('active_user_id');
    setCurrentUser({ ...INITIAL_USER, walletAddress: undefined, isKycVerified: false });
    setCurrentView(AppView.ONBOARDING);
  };

  const handleApplyForGig = (gigId: string, proposedBudget: number, message: string) => {
    setGigs(prev => prev.map(g => {
      if (g.id === gigId) {
        const applicants = g.applicants || [];
        if (applicants.some(a => a.workerId === currentUser.phoneNumber)) {
          alert("You have already applied for this gig.");
          return g;
        }
        const newApplicant: Applicant = {
          workerId: currentUser.phoneNumber || 'unknown',
          workerName: currentUser.name,
          workerAvatar: currentUser.avatar,
          workerPhone: currentUser.phoneNumber,
          workerBio: currentUser.bio,
          proposedBudget,
          message,
          skills: skills.filter(s => s.status === 'verified').map(s => s.title)
        };
        return { ...g, applicants: [...applicants, newApplicant] };
      }
      return g;
    }));
    alert("Application Sent! The employer will review your profile.");
    setCurrentView(AppView.PROFILE);
  };

  const handleHireWorker = (gigId: string, workerId: string, finalBudget: number) => {
    setGigs(prev => prev.map(g => {
      if (g.id === gigId) {
        return { ...g, status: 'assigned', workerId, budgetNum: finalBudget, budget: `₹${finalBudget}` };
      }
      return g;
    }));
    alert("Worker Hired! The gig is now assigned.");
  };

  const handleVerifyWork = (gigId: string, approved: boolean, reason?: string) => {
    const gig = gigs.find(g => g.id === gigId);
    if (!gig) return;

    if (approved) {
      setBalance(prev => prev + gig.budgetNum);
      setTransactions(prev => [{
        id: `tx_${Math.random().toString(36).substr(2, 5)}`,
        worker: currentUser.name,
        type: 'Payment',
        amount: `₹${gig.budgetNum}`,
        status: 'Completed',
        date: new Date().toLocaleDateString()
      }, ...prev]);
      setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'completed' } : g));
      alert("Work Approved! Payment released to worker.");
    } else {
      // Decline work - set status to rejected
      setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'rejected', rejectionReason: reason || "Work quality did not meet standards." } : g));
      alert("Work Submission Rejected. The worker will be notified.");
    }
  };

  const handleAddReview = (gigId: string, review: Review, isWorkerReview: boolean) => {
    setGigs(prev => prev.map(g => {
      if (g.id === gigId) {
        return isWorkerReview ? { ...g, workerReview: review } : { ...g, employerReview: review };
      }
      return g;
    }));
  };

  const handleReportProblem = (problem: Omit<ProblemReport, 'id' | 'votes' | 'status' | 'date'>) => {
    const newProblem: ProblemReport = {
      ...problem,
      id: `p_${Math.random().toString(36).substr(2, 5)}`,
      votes: 0,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    setProblems(prev => [newProblem, ...prev]);
    alert("Problem reported! Other workers can now vote on it.");
  };

  const handleVoteProblem = (problemId: string) => {
    setProblems(prev => prev.map(p => p.id === problemId ? { ...p, votes: p.votes + 1 } : p));
  };

  const handleLanguageChange = (language: string) => {
    setCurrentUser(prev => ({ ...prev, language }));
  };

  const renderView = () => {
    if (currentView === AppView.ONBOARDING) {
      return <Onboarding onAuthSuccess={handleAuthSuccess} />;
    }

    switch (currentView) {
      case AppView.PROFILE:
        return <ProfileView 
          user={currentUser} 
          skills={skills} 
          gigs={gigs.filter(g => g.workerId === currentUser.phoneNumber && g.status !== 'completed')}
          completedGigs={gigs.filter(g => g.workerId === currentUser.phoneNumber && g.status === 'completed')}
          onSubmitWork={(id, url) => setGigs(prev => prev.map(g => g.id === id ? { ...g, status: 'submitted', workProofUrl: url } : g))}
          setView={setCurrentView} 
          balance={balance} 
          setBalance={setBalance}
          onWithdraw={(amt) => {
            const amount = parseInt(amt);
            if (balance < amount) {
              alert("Insufficient balance");
              return;
            }
            setBalance(prev => prev - amount);
            setTransactions(prev => [{ 
              id: `tx_w_${Math.random().toString(36).substr(2, 5)}`, 
              worker: currentUser.name, 
              type: 'Withdrawal', 
              amount: `₹${amt}`, 
              status: 'Completed', 
              date: 'Today' 
            }, ...prev]);
            alert(`Successfully withdrawn ₹${amt}`);
          }}
          onUpdateUser={setCurrentUser}
          onAddReview={handleAddReview}
        />;
      case AppView.VERIFICATION:
        return <VerifierDashboard 
          skills={skills} 
          gigs={gigs} 
          problems={problems}
          onVerifySkill={(id, st) => setSkills(prev => prev.map(s => s.id === id ? { ...s, status: st } : s))} 
          onVerifyWork={handleVerifyWork}
          onPromoteProblem={(id) => setProblems(prev => prev.map(p => p.id === id ? { ...p, status: 'promoted' } : p))}
        />;
      case AppView.MARKETPLACE:
        return <Marketplace 
          user={currentUser} 
          userSkills={skills.filter(s => s.status === 'verified')} 
          gigs={gigs} 
          onAccept={handleApplyForGig} 
        />;
      case AppView.EMPLOYER:
        return <EmployerPortal 
          allSkills={skills} 
          transactions={transactions} 
          employerBalance={employerBalance}
          setEmployerBalance={setEmployerBalance}
          gigs={gigs.filter(g => g.postedBy === 'Business User' || g.postedBy === currentUser.name)}
          onHireWorker={handleHireWorker}
          onPostGig={(g) => {
            if (employerBalance < g.budgetNum) {
              alert("Insufficient escrow balance. Please top up.");
              return;
            }
            setEmployerBalance(prev => prev - g.budgetNum);
            setGigs(prev => [g, ...prev]);
          }} 
          onAddReview={handleAddReview}
          problems={problems}
        />;
      case AppView.COMMUNITY:
        return <WorkerCommunity 
          user={currentUser}
          problems={problems}
          onReportProblem={handleReportProblem}
          onVote={handleVoteProblem}
        />;
      case AppView.MANAGE_SKILLS:
        return <ManageSkills skills={skills} setSkills={setSkills} setView={setCurrentView} />;
      case AppView.SKILLS:
        return <SkillUpload onUpload={(s) => setSkills(prev => [s, ...prev])} onCancel={() => setCurrentView(AppView.PROFILE)} />;
      case AppView.VERIFIER_LOGIN:
        return <VerifierLogin onLogin={() => { setIsVerifierAuthenticated(true); setCurrentView(AppView.VERIFICATION); }} />;
      case AppView.EMPLOYER_LOGIN:
        return <EmployerLogin onLogin={() => { setIsEmployerAuthenticated(true); setCurrentView(AppView.EMPLOYER); }} />;
      default:
        return null;
    }
  };

  const showNav = currentUser.walletAddress && ![AppView.ONBOARDING, AppView.VERIFIER_LOGIN, AppView.EMPLOYER_LOGIN].includes(currentView);

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-50">
      <Header 
        user={currentUser} 
        onRoleChange={handleRoleChange} 
        onLanguageChange={handleLanguageChange}
        hideControls={!currentUser.walletAddress} 
        onLogout={handleLogout} 
        onShowTour={() => setShowTour(true)}
      />
      <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full">
        {renderView()}
      </main>
      {showNav && <BottomNav activeView={currentView} setView={setCurrentView} role={currentUser.role} language={currentUser.language} />}
      <AiAssistant />
      {showTour && <AppTour user={currentUser} onComplete={() => setShowTour(false)} />}
    </div>
  );
};

export default App;
