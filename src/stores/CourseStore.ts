import { makeAutoObservable, runInAction } from 'mobx';
import type { RootStore } from './RootStore';
import type { Course } from '../types';
import { MOCK_COURSES } from '../constants';

export class CourseStore {
  courses: Course[] = [];
  loading = false;
  error: string | null = null;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  async searchCourses(query: string) {
    this.loading = true;
    this.error = null;
    
    try {
      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      runInAction(() => {
        this.courses = MOCK_COURSES.filter(course => 
          course.name.toLowerCase().includes(query.toLowerCase()) ||
          course.address.toLowerCase().includes(query.toLowerCase())
        );
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch courses';
        this.loading = false;
      });
    }
  }

  clearCourses() {
    this.courses = [];
  }
}