import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapIcon } from 'lucide-react';

export default function InteractiveMapsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Interactive Course Maps</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Detailed course layouts, hole-by-hole information, and GPS yardages.
        </p>
      </header>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <MapIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Feature Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <CardDescription className="mb-6 text-md">
            We're working hard to bring you interactive maps with precise yardages, hole previews, and more. 
            Stay tuned for updates!
          </CardDescription>
          <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
            <Image
              src="https://placehold.co/800x450.png"
              alt="Placeholder map"
              width={800}
              height={450}
              className="object-cover w-full h-full"
              data-ai-hint="golf map layout"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
