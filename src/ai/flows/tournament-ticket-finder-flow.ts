'use server';
/**
 * @fileOverview An AI agent for finding information about professional golf tournament tickets.
 *
 * - findTournamentTickets - A function that provides information based on user query.
 * - TournamentTicketFinderInput - The input type for the findTournamentTickets function.
 * - TournamentTicketFinderOutput - The return type for the findTournamentTickets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoundTournamentSchema = z.object({
  tournamentName: z.string().describe("The official name of the golf tournament."),
  dates: z.string().describe("Plausible dates or date range for the tournament (e.g., 'April 8-14, 2024', 'Typically held in July')."),
  location: z.string().describe("The city, state, and country where the tournament is held (e.g., 'Augusta, GA, USA', 'St Andrews, Scotland')."),
  ticketAvailabilitySummary: z.string().describe("A summary of how tickets are typically acquired or their general availability (e.g., 'Tickets primarily via lottery system months in advance.', 'Limited general admission tickets may be sold.', 'Often sells out quickly.')."),
  howToFindTickets: z.array(z.string()).describe("Actionable advice on where/how to look for official tickets (e.g., 'Check the official tournament website: [plausible_official_url.com]', 'Look for official ticket marketplaces like Ticketmaster.', 'Consider registered travel packages.'). Provide plausible URLs if known."),
  estimatedPriceGuidance: z.string().optional().describe("Very general guidance on ticket prices (e.g., 'Practice rounds are usually less expensive than competition days.', 'Weekend passes can be several hundred to thousands of dollars depending on demand and source.')."),
  notes: z.string().optional().describe("Any other relevant notes, considerations, or specific tips for this tournament."),
});

const TournamentTicketFinderInputSchema = z.object({
  tournamentName: z.string().optional().describe("Specific tournament the user is interested in (e.g., 'The Masters', 'U.S. Open', 'Ryder Cup')."),
  location: z.string().optional().describe("General geographic area or country (e.g., 'California', 'Florida', 'UK', 'East Coast USA')."),
  timeframe: z.string().optional().describe("Desired timeframe for attending (e.g., 'next 3 months', 'Spring 2025', 'this year')."),
  ticketType: z.string().optional().describe("Type of ticket desired (e.g., 'Practice round', 'Weekend pass', 'Single day competition', 'Hospitality')."),
  budgetIndication: z.string().optional().describe("User's general budget level (e.g., 'affordable', 'mid-range', 'premium seating', 'any price is fine')."),
});
export type TournamentTicketFinderInput = z.infer<typeof TournamentTicketFinderInputSchema>;

const TournamentTicketFinderOutputSchema = z.object({
  foundTournaments: z.array(FoundTournamentSchema).describe("A list of 1 to 3 potential tournaments matching the query. If no specific matches, this can be empty."),
  searchSummary: z.string().describe("A general summary of the search, factors considered, and if no specific tournaments are found, general advice on finding golf tournament tickets or popular tournament series to watch out for."),
  disclaimer: z.string().describe("Standard disclaimer: 'This AI provides general information and guidance based on publicly available knowledge. It does not have access to real-time ticket availability or sales platforms. Always verify information and purchase tickets through official tournament channels or reputable vendors.'"),
});
export type TournamentTicketFinderOutput = z.infer<typeof TournamentTicketFinderOutputSchema>;

export async function findTournamentTickets(input: TournamentTicketFinderInput): Promise<TournamentTicketFinderOutput> {
  return tournamentTicketFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tournamentTicketFinderPrompt',
  input: {schema: TournamentTicketFinderInputSchema},
  output: {schema: TournamentTicketFinderOutputSchema},
  prompt: `You are an AI assistant specializing in providing information about professional golf tournament tickets. You DO NOT sell tickets or have access to real-time availability. Your goal is to guide users on how they might find tickets based on their query.

User's Request:
{{#if tournamentName}}- Tournament Name: "{{tournamentName}}"{{/if}}
{{#if location}}- Preferred Location: "{{location}}"{{/if}}
{{#if timeframe}}- Preferred Timeframe: "{{timeframe}}"{{/if}}
{{#if ticketType}}- Desired Ticket Type: "{{ticketType}}"{{/if}}
{{#if budgetIndication}}- Budget Indication: "{{budgetIndication}}"{{/if}}
{{#unless tournamentName}}{{#unless location}}{{#unless timeframe}} (No specific criteria provided, offer general advice or popular tournament info) {{/unless}}{{/unless}}{{/unless}}

Based on this, provide the following:
1.  'foundTournaments': A list of 1-3 plausible tournaments that might fit the user's request. For each tournament:
    *   'tournamentName': Official name.
    *   'dates': Likely dates/period (e.g., "Early April annually", "June 13-16, 2024").
    *   'location': Venue location.
    *   'ticketAvailabilitySummary': How tickets are generally obtained (e.g., lottery, public sale, secondary market focus).
    *   'howToFindTickets': Specific, actionable advice. Include plausible official website URLs if you can confidently generate them (e.g., masters.com, usopen.com, pgachampionship.com, theopen.com, lpga.com, pgatour.com, dpworldtour.com, livgolf.com). Also mention general authorized ticket sellers if applicable.
    *   'estimatedPriceGuidance': (Optional) General price ranges (e.g., "Practice rounds from $X", "Competition days $Y-$Z"). Acknowledge high variability.
    *   'notes': (Optional) Other tips (e.g., "Accommodation books up fast", "Consider volunteering for access").
    If the query is very broad or no specific tournaments come to mind, this list can be empty.
2.  'searchSummary': Summarize your findings. If no specific tournaments are listed, provide general advice on researching golf tournament tickets (e.g., "Major championships like The Masters, U.S. Open, The Open Championship, and PGA Championship are very popular. Also check PGA TOUR, LPGA, DP World Tour, or LIV Golf schedules.").
3.  'disclaimer': MANDATORY. Use this exact text: "This AI provides general information and guidance based on publicly available knowledge. It does not have access to real-time ticket availability or sales platforms. Always verify information and purchase tickets through official tournament channels or reputable vendors."

Think about major tours (PGA TOUR, LPGA, DP World Tour, LIV Golf), major championships, and well-known events.
Prioritize official sources and safe ticket-buying practices in your advice.
If the query is vague, you can suggest some popular tournaments and how to find info for them.
Ensure your output is a JSON object strictly matching the defined output schema.
`,
});

const tournamentTicketFinderFlow = ai.defineFlow(
  {
    name: 'tournamentTicketFinderFlow',
    inputSchema: TournamentTicketFinderInputSchema,
    outputSchema: TournamentTicketFinderOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Ensure disclaimer is always present
    if (output && !output.disclaimer) {
      output.disclaimer = "This AI provides general information and guidance based on publicly available knowledge. It does not have access to real-time ticket availability or sales platforms. Always verify information and purchase tickets through official tournament channels or reputable vendors.";
    }
    return output!;
  }
);

    