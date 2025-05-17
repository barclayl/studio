import { PostRoundAnalysisForm } from '@/components/round-analysis/post-round-analysis-form';

export default function PostRoundAnalysisPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
       <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">AI Post-Round Analysis</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Enter your round details and get AI-powered insights to improve your game.
        </p>
      </header>
      <PostRoundAnalysisForm />
    </div>
  );
}
