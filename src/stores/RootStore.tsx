import React from 'react';
import { makeAutoObservable } from 'mobx';
import { CourseStore } from './CourseStore';
import { UserStore } from './UserStore';
import { ScorecardStore } from './ScorecardStore';

export class RootStore {
  courseStore: CourseStore;
  userStore: UserStore;
  scorecardStore: ScorecardStore;

  constructor() {
    makeAutoObservable(this);
    this.courseStore = new CourseStore(this);
    this.userStore = new UserStore(this);
    this.scorecardStore = new ScorecardStore(this);
  }
}

const RootStoreContext = React.createContext<RootStore | null>(null);

export const RootStoreProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const store = React.useRef(new RootStore());
  return (
    <RootStoreContext.Provider value={store.current}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => {
  const store = React.useContext(RootStoreContext);
  if (!store) {
    throw new Error('useRootStore must be used within a RootStoreProvider');
  }
  return store;
};