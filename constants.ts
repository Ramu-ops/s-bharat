
import { UserRole, User, Skill, Gig, ProblemReport } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'Rahul Joshi',
  role: UserRole.GIG_WORKER,
  isKycVerified: true,
  phoneNumber: '+91 98765 43210',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  bio: 'Expert Domestic Electrician & Solar Panel Installer with 5+ years experience. Specializing in residential grid setups and maintenance.'
};

export const MOCK_VERIFIER: User = {
  id: 'v1',
  name: 'Dr. Amit Verma',
  role: UserRole.VERIFIER,
  isKycVerified: true,
  phoneNumber: '+91 99887 76655',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
  bio: 'Senior Technical Auditor with 15 years in skill certification and vocational training standards.'
};

export const MOCK_SKILLS: Skill[] = [
  {
    id: 's1',
    userId: 'u1',
    title: 'Certified Domestic Electrician',
    issuer: 'National Skill Development Corp (NSDC)',
    date: '2023-10-10',
    status: 'pending',
    ipfsHash: 'QmXoyp...7821',
    blockchainHash: '0x71C7...8976F',
    qrCode: 'SKILL_ELECTRICAL_001'
  },
  {
    id: 's2',
    userId: 'u1',
    title: 'Solar Grid Maintenance',
    issuer: 'Skill India Mission',
    date: '2023-12-15',
    status: 'verified',
    ipfsHash: 'QmZpr9...1122',
    blockchainHash: '0x9a22...f331',
    qrCode: 'SKILL_SOLAR_482'
  }
];

export const MOCK_GIGS: Gig[] = [
  {
    id: 'g1',
    title: 'Residential Solar Panel Installation',
    description: 'Require a certified electrician to install 5kW solar grid for a local apartment complex in Bangalore.',
    budget: '₹12,000',
    budgetNum: 12000,
    requiredSkills: ['Electrician', 'Solar Panel'],
    location: 'HSR Layout, Bangalore',
    postedBy: 'GreenHome Solutions',
    postedAt: '4 hours ago',
    status: 'open',
    paymentMethod: 'escrow',
    payoutType: 'wallet'
  },
  {
    id: 'g2',
    title: 'Industrial Wiring Project',
    description: 'Short-term contract for rewiring a small-scale garment factory. Must be NSDC certified.',
    budget: '₹25,000',
    budgetNum: 25000,
    requiredSkills: ['Industrial Wiring', 'Safety Standards'],
    location: 'Peenya Industrial Area',
    postedBy: 'Vikas Textiles',
    postedAt: '1 day ago',
    status: 'open',
    paymentMethod: 'escrow',
    payoutType: 'wallet'
  }
];

export const MOCK_PROBLEMS: ProblemReport[] = [
  {
    id: 'p1',
    workerId: 'u1',
    workerName: 'Rahul Joshi',
    language: 'en',
    title: 'Delayed Escrow Release',
    description: 'Sometimes it takes more than 48 hours for the verifier to check the work photos. This delays our payment.',
    votes: 15,
    status: 'promoted',
    date: '2024-01-15'
  },
  {
    id: 'p2',
    workerId: 'u2',
    workerName: 'Suresh Kumar',
    language: 'hi',
    title: 'कठिन पंजीकरण प्रक्रिया',
    description: 'आधार सत्यापन में बहुत समय लग रहा है। इसे और सरल बनाया जाना चाहिए।',
    votes: 24,
    status: 'promoted',
    date: '2024-01-18'
  },
  {
    id: 'p3',
    workerId: 'u3',
    workerName: 'Priya Singh',
    language: 'en',
    title: 'Need for Safety Gear',
    description: 'Many industrial sites do not provide basic safety equipment like gloves or helmets. We need a way to report this.',
    votes: 32,
    status: 'promoted',
    date: '2024-01-20'
  }
];

export const LANGUAGES = [
  { id: 'en', name: 'English', native: 'English' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు' },
  { id: 'mr', name: 'Marathi', native: 'मరాఠీ' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
];
