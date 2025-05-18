
import { GolfBuddyAdvisorForm } from '@/components/golf-buddy-advisor/golf-buddy-advisor-form';
import { Users } from 'lucide-react';

export default function GolfBuddyAdvisorPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
          <Users className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">AI Golf Buddy Advisor</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Get AI-powered advice on how to find compatible golf partners in your area.
        </p>
      </header>
      <GolfBuddyAdvisorForm />
    </div>
  );
}
