import { CourseList } from '@/components/courses/course-list';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

export default function CourseLocatorPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Find a Golf Course</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Discover courses near you or search for your favorite spots.
        </p>
      </header>

      <div className="mb-8 max-w-2xl mx-auto">
        <form className="flex gap-2">
          <Input
            type="search"
            placeholder="Search by name, city, or zip code..."
            className="flex-grow"
            aria-label="Search courses"
          />
          <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90">
            <SearchIcon className="h-5 w-5 mr-2 md:mr-0" />
            <span className="hidden md:inline">Search</span>
          </Button>
        </form>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          (Search functionality is a mock-up for demonstration)
        </p>
      </div>

      <CourseList />
    </div>
  );
}
