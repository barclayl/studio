import { makeAutoObservable } from 'mobx';
import type { RootStore } from './RootStore';

export class UserStore {
  skillLevel: string = 'beginner';
  name: string = '';
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setSkillLevel(level: string) {
    this.skillLevel = level;
  }

  setName(name: string) {
    this.name = name;
  }
}