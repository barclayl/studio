import type { Course } from '@/lib/types';
import { CourseCard } from './course-card';

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  if (!courses || courses.length === 0) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id || course.name} course={course} />
      ))}
    </div>
  );
}
