
import { EquipmentSuggestionForm } from '@/components/equipment-ai/equipment-suggestion-form';

export default function EquipmentAISuggestionPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">AI Golf Equipment Advisor</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Get personalized golf equipment recommendations from our AI expert.
        </p>
      </header>
      <EquipmentSuggestionForm />
    </div>
  );
}
