
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserRole } from '../types';
import { translations } from '../locales';

interface AppTourProps {
  user: User;
  onComplete: () => void;
}

const AppTour: React.FC<AppTourProps> = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const lang = user.language || 'en';
  const t = translations[lang]?.tour || translations['en'].tour;

  const getSteps = () => {
    const base = [
      { title: t.welcomeTitle, content: t.welcomeContent }
    ];

    if (user.role === UserRole.GIG_WORKER) {
      return [
        ...base,
        { title: t.workerIdentityTitle, content: t.workerIdentityContent },
        { title: t.workerSkillsTitle, content: t.workerSkillsContent },
        { title: t.workerMarketTitle, content: t.workerMarketContent },
        { title: t.workerPaymentsTitle, content: t.workerPaymentsContent }
      ];
    } else if (user.role === UserRole.VERIFIER) {
      return [
        ...base,
        { title: t.verifierRoleTitle, content: t.verifierRoleContent },
        { title: t.verifierSkillsTitle, content: t.verifierSkillsContent },
        { title: t.verifierWorkTitle, content: t.verifierWorkContent },
        { title: t.verifierTrustTitle, content: t.verifierTrustContent }
      ];
    } else {
      return [
        ...base,
        { title: t.employerHubTitle, content: t.employerHubContent },
        { title: t.employerEscrowTitle, content: t.employerEscrowContent },
        { title: t.employerReviewTitle, content: t.employerReviewContent },
        { title: t.employerGrowthTitle, content: t.employerGrowthContent }
      ];
    }
  };

  const steps = getSteps();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[300] flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
          
          <div className="relative">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-[0.2em]">{t.step} {currentStep + 1} {t.of} {steps.length}</span>
              <button onClick={onComplete} className="text-slate-400 hover:text-slate-600 transition text-xs font-medium">{t.skip}</button>
            </div>

            <h3 className="text-3xl font-semibold text-slate-900 mb-4 leading-tight">{steps[currentStep].title}</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">{steps[currentStep].content}</p>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
                ))}
              </div>
              <button 
                onClick={handleNext}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-medium shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
              >
                {currentStep === steps.length - 1 ? t.finish : t.next}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AppTour;
