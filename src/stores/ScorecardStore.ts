import { makeAutoObservable } from 'mobx';
import type { RootStore } from './RootStore';
import type { ScorecardHole } from '../types';
import { INITIAL_SCORECARD } from '../constants';

export class ScorecardStore {
  holes: ScorecardHole[] = INITIAL_SCORECARD;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  updateScore(holeIndex: number, score: number | null) {
    this.holes[holeIndex].score = score;
  }

  updatePutts(holeIndex: number, putts: number | null) {
    this.holes[holeIndex].putts = putts;
  }

  get totalScore() {
    return this.holes.reduce((sum, hole) => sum + (hole.score || 0), 0);
  }

  get totalPutts() {
    return this.holes.reduce((sum, hole) => sum + (hole.putts || 0), 0);
  }

  resetScorecard() {
    this.holes = INITIAL_SCORECARD;
  }
}