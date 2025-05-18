
import { PlayerProfileForm } from '@/components/player-profiles/player-profile-form';
import { Award } from 'lucide-react';

export default function PlayerProfilesPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
          <Award className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">AI Player Profile & Info Guide</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Enter a professional golfer's name to get a profile summary and guidance on finding official information.
        </p>
      </header>
      <PlayerProfileForm />
    </div>
  );
}
