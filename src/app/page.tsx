import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NAV_ITEMS, APP_NAME } from '@/lib/constants';
import { ArrowRight, Flag } from 'lucide-react'; // Using Flag as logo
import Image from 'next/image';

export default function HomePage() {
  const features = NAV_ITEMS.filter(item => item.href !== '/');

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-accent/10 px-3 py-1 text-sm font-medium text-accent-foreground">
                  Your Ultimate Golf Companion
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Welcome to {APP_NAME}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Elevate your game with AI-powered club suggestions, detailed course information, interactive scorecards, and more.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/courses">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/club-selection">
                    Try Club Selector
                  </Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              data-ai-hint="golf course landscape"
              width={600}
              height={400}
              alt="Golf course"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">Everything a Golfer Needs</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From finding the perfect course to analyzing your game, {APP_NAME} has you covered.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none pt-12">
            {features.map((feature) => (
              <Card key={feature.href} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="mb-2 flex justify-center items-center bg-accent/10 rounded-md h-12 w-12">
                     <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{feature.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {feature.label === 'Find Course' && 'Discover golf courses near you or anywhere in the world.'}
                    {feature.label === 'Club Selector' && 'Get AI-powered recommendations for the optimal club.'}
                    {feature.label === 'Scorecard' && 'Keep track of your scores and stats with our easy-to-use virtual scorecard.'}
                    {feature.label === 'Course Maps' && 'Interactive maps with yardages and hole layouts (Coming Soon).'}
                  </CardDescription>
                </CardContent>
                <CardContent className="pt-0">
                   <Button asChild variant="link" className="px-0 text-primary">
                    <Link href={feature.href}>
                      Explore {feature.label} <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer - minimal, main footer in (app)/layout.tsx */}
       <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Quatro Fi. All rights reserved.
      </footer>
    </div>
  );
}
