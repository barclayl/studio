import type { NavItem, Course, ScorecardHole, SkillLevel } from '@/lib/types';
import { MapPin, Calculator, ListChecks, Sparkles, Home, Users, Settings, Flag, Camera, Brain, BarChart3 } from 'lucide-react';

export const APP_NAME = "Quatro Fi";

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Find Course', icon: MapPin },
  { href: '/club-selection', label: 'Club Selector', icon: Sparkles },
  { href: '/scorecard', label: 'Scorecard', icon: ListChecks },
  { href: '/maps', label: 'Course Maps', icon: Flag }, // Using Flag as a general map icon
  { href: '/swing-analysis', label: 'Swing Analysis', icon: Camera },
  { href: '/mental-coach', label: 'Mental Coach', icon: Brain },
  { href: '/round-analysis', label: 'Round Analysis', icon: BarChart3 },
];

export const MOCK_COURSES: Course[] = [
  { 
    id: '1', 
    name: 'Pebble Beach Golf Links', 
    address: '1700 17-Mile Drive, Pebble Beach, CA', 
    distance: '5 miles', 
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'golf course beautiful',
    details: 'World-renowned public golf course along the rugged California coastline, famous for its stunning views and challenging play. It has hosted multiple U.S. Open championships.',
    reasoning: 'Pebble Beach is an iconic course that fits the "championship" and "coastal" aspects of a potential query. Its reputation makes it a prime candidate for users looking for top-tier golfing experiences.'
  },
  { 
    id: '2', 
    name: 'Augusta National Golf Club', 
    address: '2604 Washington Rd, Augusta, GA', 
    distance: '12 miles', 
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'golf green pristine',
    details: 'Home of The Masters Tournament, Augusta National is known for its immaculate conditions, beautiful azaleas, and Amen Corner. It is one of the most exclusive and revered golf clubs in the world.',
    reasoning: 'Augusta National is synonymous with championship golf. Recommending it showcases knowledge of premier golfing venues.'
  },
  { 
    id: '3', 
    name: 'St. Andrews Links (Old Course)', 
    address: 'St Andrews KY16 9SF, United Kingdom', 
    distance: '8 miles', 
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'golf links historic',
    details: 'Considered the "Home of Golf," the Old Course at St. Andrews is one of the oldest and most iconic golf courses in the world, featuring the Swilcan Bridge and Hell Bunker.',
    reasoning: 'The Old Course is a must-mention for its historical significance and unique links-style play, appealing to users interested in the origins of golf or classic courses.'
  },
  { 
    id: '4',
    name: 'Cypress Point Club',
    address: '3150 17-Mile Dr, Pebble Beach, CA',
    distance: '6 miles',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'golf coastal scenic',
    details: 'An exclusive private club designed by Alister MacKenzie, known for its breathtaking beauty, particularly the 15th, 16th, and 17th holes which play along the Pacific Ocean.',
    reasoning: 'Cypress Point is another world-class course in the Pebble Beach area, offering spectacular coastal views and a challenging layout. It complements Pebble Beach Golf Links for users looking for premier experiences in that region.'
  },
];

export const SKILL_LEVELS: SkillLevel[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const INITIAL_SCORECARD: ScorecardHole[] = Array.from({ length: 18 }, (_, i) => ({
  hole: i + 1,
  score: null, // Default to null for better UX in forms
  putts: null, // Default to null
  par: (i < 9 ? (i % 2 === 0 ? 4 : (i === 4 ? 3 : 5)) : (i % 3 === 0 ? 3 : (i === 13 || i === 17 ? 5 : 4))), // More varied default pars
}));
