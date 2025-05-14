'use client';

import { useState } from 'react';
import type { Course } from '@/lib/types';
import { selectCourse, type CourseSelectionInput } from '@/ai/flows/course-selection-flow';
import { CourseList } from '@/components/courses/course-list';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, SearchIcon, ServerCrashIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function CourseLocatorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: 'Search query empty',
        description: 'Please enter what you are looking for.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setCourses([]);

    try {
      const input: CourseSelectionInput = { searchQuery };
      const result = await selectCourse(input);
      
      if (result.recommendedCourses && result.recommendedCourses.length > 0) {
        setCourses(result.recommendedCourses as Course[]);
         toast({
          title: "Courses Found!",
          description: `We found ${result.recommendedCourses.length} course(s) matching your criteria.`,
        });
      } else {
        setCourses([]);
        toast({
          title: "No Courses Found",
          description: "Try adjusting your search query.",
          variant: "default",
        });
      }
    } catch (e) {
      console.error("Error fetching course recommendations:", e);
      setError("Failed to fetch course recommendations. Please try again later.");
      toast({
        title: "Search Error",
        description: "Could not fetch recommendations. Please check your connection or try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Find a Golf Course</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Describe what you're looking for, and our AI will find courses for you.
        </p>
      </header>

      <div className="mb-8 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="e.g., 'Courses near San Francisco with a driving range'"
            className="flex-grow"
            aria-label="Describe desired course features"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <SearchIcon className="h-5 w-5 mr-2 md:mr-0" />
                <span className="hidden md:inline">Search</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Searching for courses...</p>
        </div>
      )}

      {error && (
         <Card className="max-w-2xl mx-auto bg-destructive/10 border-destructive text-destructive-foreground">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ServerCrashIcon className="h-6 w-6" />
              <CardTitle>Search Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && courses.length === 0 && searchQuery && (
         <Card className="max-w-2xl mx-auto bg-secondary/10 border-secondary">
          <CardHeader>
             <CardTitle className="text-xl text-secondary-foreground">No Courses Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground/80">We couldn't find any courses matching your current search. Please try a different query.</p>
          </CardContent>
        </Card>
      )}
      
      {!isLoading && !error && courses.length > 0 && (
        <CourseList courses={courses} />
      )}

      {!isLoading && !error && courses.length === 0 && !searchQuery && (
         <div className="text-center text-muted-foreground py-10">
          <p>Enter a description above to start your course search.</p>
        </div>
      )}
    </div>
  );
}
