import type { Course, ScorecardHole } from './types';

export const MOCK_COURSES: Course[] = [
  { 
    id: '1', 
    name: 'Pebble Beach Golf Links', 
    address: '1700 17-Mile Drive, Pebble Beach, CA', 
    distance: '5 miles', 
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'golf course beautiful',
    details: 'World-renowned public golf course along the rugged California coastline, famous for its stunning views and challenging play.',
    reasoning: 'Iconic course that fits championship and coastal aspects.'
  },
  // ... other courses
];

export const INITIAL_SCORECARD: ScorecardHole[] = Array.from({ length: 18 }, (_, i) => ({
  hole: i + 1,
  score: null, 
  putts: null, 
  par: (i < 9 ? (i % 2 === 0 ? 4 : (i === 4 ? 3 : 5)) : (i % 3 === 0 ? 3 : (i === 13 || i === 17 ? 5 : 4))), 
}));

export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];