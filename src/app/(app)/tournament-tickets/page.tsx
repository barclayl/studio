
import { TournamentTicketFinderForm } from '@/components/tournament-tickets/tournament-ticket-finder-form';
import { Ticket } from 'lucide-react';

export default function TournamentTicketsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
          <Ticket className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">AI Tournament Ticket Finder</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          Discover information on professional golf tournaments and get guidance on finding tickets.
        </p>
      </header>
      <TournamentTicketFinderForm />
    </div>
  );
}

    