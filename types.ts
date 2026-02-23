
export enum AppView {
  ONBOARDING = 'onboarding',
  PROFILE = 'profile',
  SKILLS = 'skills',
  VERIFICATION = 'verification',
  MARKETPLACE = 'marketplace',
  EMPLOYER = 'employer',
  MANAGE_SKILLS = 'manage_skills',
  VERIFIER_LOGIN = 'verifier_login',
  EMPLOYER_LOGIN = 'employer_login',
  COMMUNITY = 'community'
}

export enum UserRole {
  GIG_WORKER = 'gig_worker',
  VERIFIER = 'verifier',
  EMPLOYER = 'employer'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  aadhaarNumber?: string;
  phoneNumber?: string;
  walletAddress?: string;
  bio?: string;
  avatar?: string;
  isKycVerified: boolean;
  language?: string;
  location?: {
    city: string;
    lat: number;
    lng: number;
  };
  workRadius?: number; // in km
  rating?: number;
  totalReviews?: number;
}

export interface Skill {
  id: string;
  userId: string;
  title: string;
  issuer: string;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
  ipfsHash: string;
  blockchainHash: string;
  qrCode?: string;
  evidenceUrl?: string;
}

export interface Applicant {
  workerId: string;
  workerName: string;
  workerAvatar?: string;
  workerPhone?: string;
  workerBio?: string;
  proposedBudget: number;
  message?: string;
  skills: string[];
}

export interface Review {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ProblemReport {
  id: string;
  workerId: string;
  workerName: string;
  language: string;
  title: string;
  description: string;
  votes: number;
  status: 'pending' | 'promoted' | 'solved';
  date: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  budget: string;
  budgetNum: number;
  requiredSkills: string[];
  location: string;
  coords?: { lat: number; lng: number };
  postedBy: string;
  postedAt: string;
  status: 'open' | 'assigned' | 'submitted' | 'completed' | 'rejected';
  workerId?: string;
  workProofUrl?: string;
  applicants?: Applicant[];
  paymentMethod: 'escrow' | 'direct';
  payoutType: 'wallet' | 'upi' | 'cash';
  workerReview?: Review;
  employerReview?: Review;
  rejectionReason?: string;
}

export interface MatchingResult {
  gigId: string;
  relevanceReason: string;
  matchScore: number;
}

export interface Transaction {
  id: string;
  worker: string;
  type: 'Payment' | 'Verification' | 'Withdrawal';
  amount?: string;
  status: 'Completed' | 'Pending';
  date: string;
}
