
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { findTournamentTickets } from '@/ai/flows/tournament-ticket-finder-flow';
import type { TournamentTicketFinderInput, TournamentTicketFinderOutput, FoundTournament } from '@/ai/flows/tournament-ticket-finder-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Sparkles, TicketIcon, Search, Info, ExternalLink, AlertTriangle } from 'lucide-react';
import { TICKET_TYPES_OPTIONS, BUDGET_INDICATION_OPTIONS } from '@/lib/constants';

const formSchema = z.object({
  tournamentName: z.string().optional(),
  location: z.string().optional(),
  timeframe: z.string().optional(),
  ticketType: z.string().optional(),
  budgetIndication: z.string().optional(),
});

export function TournamentTicketFinderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TournamentTicketFinderOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: '',
      location: '',
      timeframe: '',
      ticketType: 'any',
      budgetIndication: 'any',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await findTournamentTickets(values as TournamentTicketFinderInput);
      setResult(response);
      if (response.foundTournaments && response.foundTournaments.length > 0) {
        toast({
          title: 'Tournament Info Found!',
          description: `AI has provided information for ${response.foundTournaments.length} potential tournament(s).`,
        });
      } else {
         toast({
          title: 'Search Complete',
          description: response.searchSummary || "See general advice below.",
        });
      }
    } catch (error) {
      console.error('Error getting tournament ticket info:', error);
      toast({
        title: 'Search Error',
        description: 'Could not retrieve tournament ticket information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Find Tournament Ticket Info</CardTitle>
          </div>
          <CardDescription>
            Enter your preferences and let our AI guide you on finding tickets for professional golf tournaments. All fields are optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tournamentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tournament Name (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., The Masters, U.S. Open" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., California, UK, Augusta" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeframe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeframe (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., Next 3 months, Spring 2025" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ticketType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Type (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select ticket type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {TICKET_TYPES_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budgetIndication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Indication (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select budget level" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {BUDGET_INDICATION_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching for Info...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Get Ticket Info</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">AI is searching for tournament ticket information...</p>
        </div>
      )}

      {result && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500 max-w-4xl mx-auto">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
               <TicketIcon className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">Tournament Ticket Information</CardTitle>
            </div>
            {result.disclaimer && (
                <Card className="mt-4 bg-destructive/10 border-destructive text-destructive-foreground">
                    <CardHeader className="pb-2 pt-3">
                        <CardTitle className="text-md flex items-center gap-2"><AlertTriangle className="h-5 w-5"/>Important Disclaimer</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <p className="text-xs">{result.disclaimer}</p>
                    </CardContent>
                </Card>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {result.foundTournaments && result.foundTournaments.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-primary mb-3">Potential Tournaments</h3>
                <Accordion type="single" collapsible className="w-full" defaultValue="tournament-0">
                  {result.foundTournaments.map((tournament, index) => (
                    <AccordionItem value={`tournament-${index}`} key={`tournament-${index}-${tournament.tournamentName}`}>
                      <AccordionTrigger className="text-lg hover:no-underline">
                        {tournament.tournamentName}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 space-y-3 text-sm">
                        <p><strong className="text-primary">Dates:</strong> {tournament.dates}</p>
                        <p><strong className="text-primary">Location:</strong> {tournament.location}</p>
                        <p><strong className="text-primary">Ticket Availability:</strong> {tournament.ticketAvailabilitySummary}</p>
                        <div>
                          <strong className="text-primary">How to Find Tickets:</strong>
                          <ul className="list-disc list-inside ml-4 space-y-1 mt-1">
                            {tournament.howToFindTickets.map((tip, tipIdx) => {
                              const urlMatch = tip.match(/https?:\/\/[^\s]+/);
                              if (urlMatch) {
                                const url = urlMatch[0];
                                const textBefore = tip.substring(0, urlMatch.index);
                                const textAfter = tip.substring((urlMatch.index || 0) + url.length);
                                return (
                                  <li key={tipIdx}>
                                    {textBefore}
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80">
                                      {url} <ExternalLink className="inline h-3 w-3" />
                                    </a>
                                    {textAfter}
                                  </li>
                                );
                              }
                              return <li key={tipIdx}>{tip}</li>;
                            })}
                          </ul>
                        </div>
                        {tournament.estimatedPriceGuidance && <p><strong className="text-primary">Price Guidance:</strong> {tournament.estimatedPriceGuidance}</p>}
                        {tournament.notes && <p><strong className="text-primary">Notes:</strong> {tournament.notes}</p>}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg text-muted-foreground">No Specific Tournaments Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{result.searchSummary}</p>
                </CardContent>
              </Card>
            )}
            
            {result.foundTournaments && result.foundTournaments.length > 0 && result.searchSummary && (
                 <Card className="bg-primary/5 border-primary/20 mt-6">
                    <CardHeader className="pb-2 pt-3">
                        <CardTitle className="text-md text-primary flex items-center gap-2"><Info className="h-5 w-5"/>Search Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <p className="text-sm text-primary/90">{result.searchSummary}</p>
                    </CardContent>
                </Card>
            )}

          </CardContent>
        </Card>
      )}
       {!isLoading && !result && (
         <Card className="shadow-md bg-secondary/30 border-secondary max-w-3xl mx-auto">
           <CardHeader>
             <div className="flex items-center gap-2">
                <Info className="h-6 w-6 text-secondary-foreground" />
               <CardTitle className="text-xl text-secondary-foreground">Ready to find tickets?</CardTitle>
             </div>
           </CardHeader>
           <CardContent>
             <p className="text-secondary-foreground/80">
               Fill out the form above to get AI-powered guidance on finding professional golf tournament tickets.
             </p>
           </CardContent>
         </Card>
       )}
    </div>
  );
}

    