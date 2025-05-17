import { MentalCoachForm } from '@/components/mental-coach/mental-coach-form';

export default function MentalCoachPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">AI Mental Game Coach</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Describe your mental challenges and get personalized advice to strengthen your golf psychology.
        </p>
      </header>
      <MentalCoachForm />
    </div>
  );
}
