import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
}

export interface Course {
  id: string;
  name: string;
  address: string;
  distance: string; // e.g., "5 miles", "nearby"
  imageUrl: string;
  dataAiHint: string;
  details: string; // Detailed description from AI
  reasoning: string; // Why AI recommended this course
}

export interface ScorecardHole {
  hole: number;
  score: number | null;
  putts: number | null;
  par: number;
}

export interface ScorecardEntry {
  playerName: string;
  holes: ScorecardHole[];
  totalScore: number;
  totalPutts: number;
}

export interface SkillLevel {
  value: string;
  label: string;
}
