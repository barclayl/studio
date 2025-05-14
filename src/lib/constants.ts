import type { NavItem, Course, ScorecardHole, SkillLevel } from '@/lib/types';
import { MapPin, Calculator, ListChecks, Sparkles, Home, Users, Settings, Flag } from 'lucide-react';

export const APP_NAME = "Swift Caddie";

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Find Course', icon: MapPin },
  { href: '/club-selection', label: 'Club Selector', icon: Sparkles },
  { href: '/scorecard', label: 'Scorecard', icon: ListChecks },
  { href: '/maps', label: 'Course Maps', icon: Flag }, // Using Flag as a general map icon
];

export const MOCK_COURSES: Course[] = [
  { 
    id: '1', 
    name: 'Pebble Beach Golf Links', 
    address: '1700 17-Mile Drive, Pebble Beach, CA', 
    distance: '5 miles', 
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'golf course beautiful'
  },
  { 
    id: '2', 
    name: 'Augusta National Golf Club', 
    address: '2604 Washington Rd, Augusta, GA', 
    distance: '12 miles', 
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'golf green pristine' 
  },
  { 
    id: '3', 
    name: 'St. Andrews Links (Old Course)', 
    address: 'St Andrews KY16 9SF, United Kingdom', 
    distance: '8 miles', 
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'golf links historic'
  },
  { 
    id: '4',
    name: 'Cypress Point Club',
    address: '3150 17-Mile Dr, Pebble Beach, CA',
    distance: '6 miles',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'golf coastal scenic'
  },
];

export const SKILL_LEVELS: SkillLevel[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const INITIAL_SCORECARD: ScorecardHole[] = Array.from({ length: 18 }, (_, i) => ({
  hole: i + 1,
  score: 0,
  putts: 0,
  par: 4, // Default par, can be adjusted
}));
