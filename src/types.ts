export interface Course {
  id: string;
  name: string;
  address: string;
  distance: string;
  imageUrl: string;
  dataAiHint: string;
  details: string;
  reasoning: string;
}

export interface ScorecardHole {
  hole: number;
  score: number | null;
  putts: number | null;
  par: number;
}

export interface SkillLevel {
  value: string;
  label: string;
}