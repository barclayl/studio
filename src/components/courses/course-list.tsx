import type { Course } from '@/lib/types';
import { CourseCard } from './course-card';
import { MOCK_COURSES } from '@/lib/constants'; // Using mock data for now

export function CourseList() {
  const courses: Course[] = MOCK_COURSES; // In a real app, this would come from an API

  if (courses.length === 0) {
    return <p className="text-center text-muted-foreground">No courses found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
