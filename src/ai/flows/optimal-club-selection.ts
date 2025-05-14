'use server';
/**
 * @fileOverview An AI agent for suggesting the optimal golf club for a shot.
 *
 * - optimalClubSelection - A function that suggests the optimal club for a golf shot.
 * - OptimalClubSelectionInput - The input type for the optimalClubSelection function.
 * - OptimalClubSelectionOutput - The return type for the optimalClubSelection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimalClubSelectionInputSchema = z.object({
  gpsLocation: z
    .string()
    .describe('The GPS coordinates of the golfer, e.g., 34.0522,-118.2437.'),
  weatherConditions: z
    .string()
    .describe('The current weather conditions, e.g., sunny, 75 degrees, wind 10 mph from the west.'),
  userSkillLevel: z
    .string()
    .describe(
      'The skill level of the golfer, e.g., beginner, intermediate, advanced.'
    ),
  courseConditions: z
    .string()
    .describe(
      'Information about the course conditions that may affect club selection, e.g., firm fairways, fast greens, water hazard to the left.'
    ),
  distanceToPin: z
    .number()
    .describe(
      'The distance in yards from the golfer to the pin. e.g., 150.'
    ),
});
export type OptimalClubSelectionInput = z.infer<
  typeof OptimalClubSelectionInputSchema
>;

const OptimalClubSelectionOutputSchema = z.object({
  recommendedClub: z
    .string()
    .describe(
      'The recommended golf club for the shot, e.g., 7 iron, 3 wood, driver.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the club selection, taking into account the input parameters.'
    ),
});
export type OptimalClubSelectionOutput = z.infer<
  typeof OptimalClubSelectionOutputSchema
>;

export async function optimalClubSelection(
  input: OptimalClubSelectionInput
): Promise<OptimalClubSelectionOutput> {
  return optimalClubSelectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimalClubSelectionPrompt',
  input: {schema: OptimalClubSelectionInputSchema},
  output: {schema: OptimalClubSelectionOutputSchema},
  prompt: `You are an expert golf caddie, skilled at selecting the optimal club for a golfer based on course conditions, weather, and the golfer's skill level.

  Based on the following information, recommend a club and explain your reasoning:

  GPS Location: {{{gpsLocation}}}
  Weather Conditions: {{{weatherConditions}}}
  User Skill Level: {{{userSkillLevel}}}
  Course Conditions: {{{courseConditions}}}
  Distance to Pin: {{{distanceToPin}}} yards
  `,
});

const optimalClubSelectionFlow = ai.defineFlow(
  {
    name: 'optimalClubSelectionFlow',
    inputSchema: OptimalClubSelectionInputSchema,
    outputSchema: OptimalClubSelectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
