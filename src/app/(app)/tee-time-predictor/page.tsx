
import { TeeTimePredictorForm } from '@/components/tee-time-predictor/tee-time-form';

export default function TeeTimePredictorPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">AI Tee Time Predictor</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Get an AI-powered prediction for tee time availability based on your preferences.
        </p>
      </header>
      <TeeTimePredictorForm />
    </div>
  );
}
