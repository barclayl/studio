'use server';
/**
 * @fileOverview An AI agent for generating golf player profiles and information guidance.
 *
 * - getPlayerProfile - A function that provides a profile and info sources for a given player.
 * - PlayerProfileInput - The input type for the getPlayerProfile function.
 * - PlayerProfileOutput - The return type for the getPlayerProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InformationSourcesSchema = z.object({
  officialWebsite: z.string().url().optional().describe("A plausible link to the player's official website, if commonly known or easily found."),
  rankings: z.string().describe("Guidance on where to find official world rankings (e.g., 'Check the Official World Golf Ranking (OWGR) website at owgr.com for men's rankings.')."),
  tourScheduleAndScores: z.string().describe("Guidance on where to find tour schedules, tee times, and live scores for the tours the player likely competes on (e.g., 'For PGA TOUR events, visit PGATOUR.com. For LPGA events, visit LPGA.com.')."),
  newsAndUpdates: z.string().describe("General advice on finding news and updates (e.g., 'Follow major sports news outlets like ESPN, Golf Channel, and official tour websites for the latest news.').")
});

const PlayerProfileInputSchema = z.object({
  playerName: z.string().min(3, "Player name must be at least 3 characters.").describe('The full name of the professional golfer.'),
});
export type PlayerProfileInput = z.infer<typeof PlayerProfileInputSchema>;

const PlayerProfileOutputSchema = z.object({
  playerName: z.string().describe("The name of the player, as understood or standardized by the AI."),
  biography: z.string().describe("A concise biographical summary of the player, including nationality, and notable career achievements or characteristics. If the player is not well-known, state that information is limited."),
  careerHighlights: z.array(z.string()).describe("A list of 3-5 key career highlights or significant achievements (e.g., major wins, significant records)."),
  playingStyle: z.string().optional().describe("A brief description of the player's typical playing style (e.g., 'Known for powerful driving and aggressive play', 'Strategic player with a strong short game')."),
  informationSources: InformationSourcesSchema.describe("Guidance on where to find official and up-to-date information about the player."),
  funFact: z.string().optional().describe("An interesting or lesser-known fact about the player."),
  disclaimer: z.string().describe("A standard disclaimer stating that the AI provides general information and does not have access to real-time stats, scores, or betting odds, and users should consult official sources."),
});
export type PlayerProfileOutput = z.infer<typeof PlayerProfileOutputSchema>;

export async function getPlayerProfile(input: PlayerProfileInput): Promise<PlayerProfileOutput> {
  return playerProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'playerProfilePrompt',
  input: {schema: PlayerProfileInputSchema},
  output: {schema: PlayerProfileOutputSchema},
  prompt: `You are an AI Golf Encyclopedia. A user wants to know more about a professional golfer: "{{playerName}}".

Provide a profile for this player. If the player is not a widely recognized professional golfer, state that information is limited for the biography and other specific fields.

Your response MUST include:
1.  'playerName': The player's name, corrected or standardized if necessary.
2.  'biography': A summary of their career, nationality, and key facts. If not well-known, state "Limited biographical information available for {{playerName}}."
3.  'careerHighlights': 3-5 bullet points of major achievements. If none are known, provide an empty array or state "No specific career highlights found in general knowledge."
4.  'playingStyle': (Optional) A brief description of their style.
5.  'informationSources': An object with guidance:
    *   'officialWebsite': (Optional) A plausible official website URL if one is commonly known (e.g., tigerwoods.com).
    *   'rankings': How to find official rankings (e.g., "Official World Golf Ranking (OWGR) website for men, Rolex Rankings for women.").
    *   'tourScheduleAndScores': Where to find schedules, tee times, and scores (e.g., "Check official tour websites like PGATOUR.com, LPGA.com, DPWorldTour.com, LIVGolf.com depending on the player's main tour.").
    *   'newsAndUpdates': General advice for news (e.g., "Major sports news outlets and official tour websites.").
6.  'funFact': (Optional) An interesting tidbit.
7.  'disclaimer': MANDATORY. Use this exact text: "This information is based on general knowledge up to my last update and does not include real-time data. For current rankings, live scores, tournament entries, tee times, or betting odds, please consult official tour websites (like PGATOUR.com, LPGA.com), official ranking sites (like OWGR.com), and reputable sports news outlets or betting platforms."

Do not invent statistics, current tournament participation, scores, or betting odds. Focus on factual, general information and guidance to official sources.
Ensure your output is a JSON object strictly matching the defined output schema.
`,
});

const playerProfileFlow = ai.defineFlow(
  {
    name: 'playerProfileFlow',
    inputSchema: PlayerProfileInputSchema,
    outputSchema: PlayerProfileOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate a player profile. Please try again.");
    }
    // Ensure disclaimer is always present and correct
    output.disclaimer = "This information is based on general knowledge up to my last update and does not include real-time data. For current rankings, live scores, tournament entries, tee times, or betting odds, please consult official tour websites (like PGATOUR.com, LPGA.com), official ranking sites (like OWGR.com), and reputable sports news outlets or betting platforms.";
    return output;
  }
);

