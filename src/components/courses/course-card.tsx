import Image from 'next/image';
import type { Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPinIcon, InfoIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl flex flex-col h-full">
      <CardHeader className="p-0">
        <Image
          src={course.imageUrl || "https://placehold.co/600x400.png"}
          alt={course.name}
          width={600}
          height={400}
          className="aspect-[3/2] w-full object-cover"
          data-ai-hint={course.dataAiHint || "golf course"}
        />
      </CardHeader>
      <CardContent className="p-6 space-y-3 flex-grow">
        <CardTitle className="text-xl lg:text-2xl">{course.name}</CardTitle>
        <div className="flex items-start text-sm text-muted-foreground">
          <MapPinIcon className="mr-2 h-4 w-4 mt-0.5 shrink-0" />
          <span>{course.address}</span>
        </div>
        {course.distance && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">Distance:</span> {course.distance}
          </p>
        )}
        
        {course.details && (
          <div className="space-y-1 pt-2">
            <h4 className="text-sm font-semibold text-primary flex items-center">
              <InfoIcon className="mr-2 h-4 w-4" />
              About this course
            </h4>
            <CardDescription className="text-xs leading-relaxed line-clamp-3 hover:line-clamp-none transition-all duration-300">{course.details}</CardDescription>
          </div>
        )}

        {course.reasoning && (
           <div className="space-y-1 pt-2">
            <h4 className="text-sm font-semibold text-primary flex items-center">
              <SparklesIcon className="mr-2 h-4 w-4 text-accent" />
              Why it's a match
            </h4>
            <CardDescription className="text-xs italic leading-relaxed line-clamp-2 hover:line-clamp-none transition-all duration-300">{course.reasoning}</CardDescription>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="outline" className="w-full bg-primary/10 hover:bg-primary/20 border-primary text-primary">
          {/* Updated link to pass course name and address as query params */}
          <Link href={`/maps?courseName=${encodeURIComponent(course.name)}&address=${encodeURIComponent(course.address)}`}>
            View Details / Map
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
