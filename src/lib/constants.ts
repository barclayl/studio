
import type { NavItem, Course, ScorecardHole, SkillLevel } from '@/lib/types';
import { MapPin, Calculator, ListChecks, Sparkles, Home, Users, Settings, Flag, Camera, Brain, BarChart3, ShoppingBag, Target, CalendarClock, Ticket } from 'lucide-react';

export const APP_NAME = "Quatro Fi";

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Find Course', icon: MapPin },
  { href: '/club-selection', label: 'Club Selector', icon: Sparkles },
  { href: '/scorecard', label: 'Scorecard', icon: ListChecks },
  { href: '/maps', label: 'Course Maps', icon: Flag }, 
  { href: '/swing-analysis', label: 'Swing Analysis', icon: Camera },
  { href: '/mental-coach', label: 'Mental Coach', icon: Brain },
  { href: '/round-analysis', label: 'Round Analysis', icon: BarChart3 },
  { href: '/equipment-ai', label: 'Equipment AI', icon: ShoppingBag },
  { href: '/practice-planner', label: 'Practice Planner', icon: Target },
  { href: '/tee-time-predictor', label: 'Tee Time Predictor', icon: CalendarClock },
  { href: '/tournament-tickets', label: 'Tournament Tickets', icon: Ticket },
  { href: '/golf-buddy-advisor', label: 'Golf Buddy Advisor', icon: Users },
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

export const USER_SKILL_LEVELS_WITH_ANY: SkillLevel[] = [
  ...SKILL_LEVELS,
  { value: "any", label: "Any Skill Level" },
];


// Also used for Practice Planner skill level
export const EQUIPMENT_SKILL_LEVELS: SkillLevel[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "professional", label: "Professional" }, // Professional might be too high for general practice plans, consider removing or AI handles it.
];

export const BUDGET_OPTIONS: { value: string; label: string }[] = [
  { value: "economy", label: "Economy (Best Value)" },
  { value: "mid-range", label: "Mid-Range (Balance of Price & Performance)" },
  { value: "premium", label: "Premium (Top Tier, Latest Tech)" },
  { value: "no-limit", label: "No Limit (Best regardless of cost)" },
];

export const EQUIPMENT_TYPES: string[] = [
  "Driver",
  "Fairway Wood",
  "Hybrid",
  "Set of Irons",
  "Driving Irons / Utility Iron",
  "Wedge (Pitching, Gap, Sand, Lob)",
  "Putter",
  "Golf Balls",
  "Golf Bag",
  "Golf Shoes",
  "Rangefinder / GPS Device",
  "Complete Set (Beginner)",
];

export const GOLF_IMPROVEMENT_AREAS: string[] = [
  "Driving Accuracy",
  "Driving Distance",
  "Iron Play (Approach Shots)",
  "Short Game (Chipping/Pitching)",
  "Bunker Play",
  "Putting (Short Putts)",
  "Putting (Lag Putting)",
  "Course Management",
  "Mental Game",
  "Consistency",
  "Specific Shot Shaping (e.g., Draws, Fades)",
];


export const INITIAL_SCORECARD: ScorecardHole[] = Array.from({ length: 18 }, (_, i) => ({
  hole: i + 1,
  score: null, 
  putts: null, 
  par: (i < 9 ? (i % 2 === 0 ? 4 : (i === 4 ? 3 : 5)) : (i % 3 === 0 ? 3 : (i === 13 || i === 17 ? 5 : 4))), 
}));

export const TIME_PREFERENCES: { value: string; label: string }[] = [
  { value: "early morning", label: "Early Morning (Before 8 AM)" },
  { value: "morning", label: "Morning (8 AM - 12 PM)" },
  { value: "mid-day", label: "Mid-Day (12 PM - 2 PM)" },
  { value: "afternoon", label: "Afternoon (2 PM - 5 PM)" },
  { value: "twilight", label: "Twilight (After 5 PM)" },
  { value: "any", label: "Any Time" },
];

export const NUMBER_OF_PLAYERS_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "1 Player" },
  { value: 2, label: "2 Players" },
  { value: 3, label: "3 Players" },
  { value: 4, label: "4 Players" },
];


export const TICKET_TYPES_OPTIONS: { value: string; label: string }[] = [
    { value: "any", label: "Any Type" },
    { value: "practice round", label: "Practice Round" },
    { value: "single day competition", label: "Single Day (Competition)" },
    { value: "weekend pass", label: "Weekend Pass" },
    { value: "full week pass", label: "Full Week Pass" },
    { value: "hospitality package", label: "Hospitality Package" },
];

export const BUDGET_INDICATION_OPTIONS: { value: string; label: string }[] = [
    { value: "any", label: "Any Price / Not Specified" },
    { value: "affordable", label: "Affordable / Budget-Friendly" },
    { value: "mid-range", label: "Mid-Range" },
    { value: "premium", label: "Premium / Best Available" },
];

export const PLAYING_FREQUENCY_OPTIONS: { value: string; label: string }[] = [
    { value: "weekends only", label: "Weekends Only" },
    { value: "weekday mornings", label: "Weekday Mornings" },
    { value: "weekday afternoons", label: "Weekday Afternoons" },
    { value: "weekday evenings", label: "Weekday Evenings" },
    { value: "1-2 times a week", label: "1-2 Times a Week" },
    { value: "2-3 times a month", label: "2-3 Times a Month" },
    { value: "once a month", label: "Once a Month" },
    { value: "flexible/varies", label: "Flexible / Varies" },
];

export const GAME_TYPE_PREFERENCE_OPTIONS: { value: string; label: string }[] = [
    { value: "casual rounds", label: "Casual Rounds" },
    { value: "competitive matches", label: "Competitive Matches" },
    { value: "practice range buddy", label: "Practice Range Buddy" },
    { value: "social golf group (9 holes)", label: "Social Golf Group (9 Holes)" },
    { value: "social golf group (18 holes)", label: "Social Golf Group (18 Holes)" },
    { value: "tournament partner", label: "Tournament Partner" },
    { value: "focused on improvement", label: "Focused on Improvement" },
    { value: "just for fun/exercise", label: "Just for Fun/Exercise" },
];

export const AGE_GROUP_PREFERENCE_OPTIONS: { value: string; label: string }[] = [
    { value: "any age", label: "Any Age Group" },
    { value: "under 18", label: "Under 18" },
    { value: "18-25", label: "18-25" },
    { value: "26-35", label: "26-35" },
    { value: "36-45", label: "36-45" },
    { value: "46-55", label: "46-55" },
    { value: "56-65", label: "56-65" },
    { value: "65+", label: "65+" },
];

    
