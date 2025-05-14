import Image from 'next/image';
import type { Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPinIcon } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <Image
          src={course.imageUrl}
          alt={course.name}
          width={600}
          height={400}
          className="aspect-[3/2] w-full object-cover"
          data-ai-hint={course.dataAiHint}
        />
      </CardHeader>
      <CardContent className="p-6 space-y-2">
        <CardTitle className="text-2xl">{course.name}</CardTitle>
        <div className="flex items-center text-muted-foreground">
          <MapPinIcon className="mr-2 h-4 w-4" />
          <span>{course.address}</span>
        </div>
        <CardDescription>{course.distance} away</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          {/* Placeholder link, eventually to course details or map */}
          <Link href={`/maps?courseId=${course.id}`}>View on Map</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
