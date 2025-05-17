import { SwingAnalysisForm } from '@/components/swing-analysis/swing-analysis-form';

export default function SwingAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">AI Swing Analysis</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Upload an image of your swing and get expert feedback from our AI coach.
        </p>
      </header>
      <SwingAnalysisForm />
    </div>
  );
}
