
'use server';
/**
 * @fileOverview An AI agent for predicting golf tee time availability.
 *
 * - predictTeeTimes - A function that predicts tee time availability based on user inputs.
 * - TeeTimePredictorInput - The input type for the predictTeeTimes function.
 * - TeeTimePredictorOutput - The return type for the predictTeeTimes function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const TeeTimePredictorInputSchema = z.object({
  courseName: z.string().min(3, 'Course name must be at least 3 characters.').describe('The name of the golf course.'),
  location: z.string().min(3, 'Location must be at least 3 characters.').describe('The city and state/region of the golf course (e.g., "Pebble Beach, CA").'),
  date: z.string().describe("The desired date for playing (e.g., 'tomorrow', 'next Saturday', '2024-10-23')."),
  timePreference: z.string().describe("User's preferred time of day (e.g., 'morning', 'around 10 AM', 'afternoon', 'any', 'twilight')."),
  numberOfPlayers: z.coerce.number().min(1).max(4).describe('Number of players (typically 1-4).'),
  weatherForecast: z.string().optional().describe("Optional: Brief weather forecast if known (e.g., 'sunny and warm', 'chance of afternoon showers', 'cold and windy')."),
});
export type TeeTimePredictorInput = z.infer<typeof TeeTimePredictorInputSchema>;

const PredictedTeeTimeSlotSchema = z.object({
  time: z.string().describe("The predicted tee time slot, e.g., '8:30 AM', '1:00 PM - 2:00 PM slot'."),
  availabilityLevel: z.enum(['Very Likely Available', 'Likely Available', 'Moderately Likely', 'Less Likely', 'Very Unlikely / Booked']).describe("Predicted availability level for this time slot."),
  reasoning: z.string().describe("Brief reasoning for the prediction of this specific time slot, considering typical patterns, day, time, etc."),
  notes: z.string().optional().describe("Any additional notes for this specific time slot, e.g., 'Could be busy due to a league', 'Might have frost delay if early'.")
});

const TeeTimePredictorOutputSchema = z.object({
  predictedTeeTimes: z.array(PredictedTeeTimeSlotSchema).describe("A list of 3-5 predicted tee time slots and their likely availability. Provide a mix if 'any' time is preferred."),
  overallAnalysis: z.string().describe("A general analysis of the request, considering factors like typical course busyness for the given day/time, group size, and weather if provided. Explain the general difficulty of getting a tee time."),
  bookingAdvice: z.string().describe("General advice for booking, e.g., 'Weekends are very busy; book at least a week in advance.', 'Check for online specials for twilight times.', 'Singles might have better luck calling the pro shop directly.'"),
  importantDisclaimer: z.string().describe("ALWAYS include a disclaimer that these are predictions and actual availability must be confirmed directly with the golf course or their booking system."),
});
export type TeeTimePredictorOutput = z.infer<typeof TeeTimePredictorOutputSchema>;

export async function predictTeeTimes(input: TeeTimePredictorInput): Promise<TeeTimePredictorOutput> {
  return teeTimePredictorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'teeTimePredictorPrompt',
  input: {schema: TeeTimePredictorInputSchema},
  output: {schema: TeeTimePredictorOutputSchema},
  prompt: `You are an expert golf concierge and tee time advisor with extensive knowledge of general golf course booking patterns. You DO NOT have access to real-time booking systems. Your predictions are based on common trends.

A golfer is asking for tee time availability predictions based on the following details:
- Course Name: {{courseName}}
- Location: {{location}}
- Desired Date: {{date}}
- Preferred Time: "{{timePreference}}"
- Number of Players: {{numberOfPlayers}}
{{#if weatherForecast}}- Known Weather Forecast: "{{weatherForecast}}"{{/if}}

Based on this, provide:
1.  'predictedTeeTimes': A list of 3-5 distinct tee time slots with their predicted availability level ('Very Likely Available', 'Likely Available', 'Moderately Likely', 'Less Likely', 'Very Unlikely / Booked'). For each, include 'reasoning' based on typical patterns (e.g., "Early morning weekend slots are prime time and book up fast", "Mid-week afternoons are usually quieter", "Large groups are harder to accommodate last minute"). Add optional 'notes' if relevant (e.g., 'Frost delay possible for very early times in colder seasons').
2.  'overallAnalysis': Briefly analyze the request. How easy or difficult will it likely be to get a tee time? Consider day of the week (weekends are much busier than weekdays), time of day (mornings are popular, twilight might be easier), group size (larger groups need more notice), and any impact from the weather forecast (bad weather might mean more openings, perfect weather means higher demand).
3.  'bookingAdvice': Offer general tips for booking at a course like this for the given parameters. Examples: "Call the pro shop X days in advance", "Look for online booking systems", "Be flexible with your time by +/- 1 hour for better chances".
4.  'importantDisclaimer': CRITICAL: You MUST include a disclaimer stating: "These are AI-generated predictions based on general patterns and not real-time availability. Please confirm actual tee times directly with {{courseName}} or their official booking channels."

General knowledge to use:
- Weekends (Saturday, Sunday) and public holidays are significantly busier than weekdays.
- Morning times (especially 8 AM - 11 AM) are generally the most popular.
- Weekday afternoons (1 PM - 3 PM) are often less busy.
- Twilight times (late afternoon, varies by season) can offer more availability and sometimes discounts.
- Larger groups (3-4 players) are harder to accommodate without advance booking than singles or pairs.
- Extremely hot, cold, or rainy weather can lead to cancellations and more open slots, but comfortable weather increases demand.
- Some courses have leagues or regular events on certain days/times that affect availability. (You can mention this as a possibility if relevant).

Structure your response strictly according to the TeeTimePredictorOutputSchema.
Consider the 'date' input carefully - if it's a specific date like '2024-10-23', determine the day of the week yourself to inform your prediction. If it's vague like 'next Saturday', use that.
If 'timePreference' is 'any', try to provide a spread of predictions across different times of day.
`,
});

const teeTimePredictorFlow = ai.defineFlow(
  {
    name: 'teeTimePredictorFlow',
    inputSchema: TeeTimePredictorInputSchema,
    outputSchema: TeeTimePredictorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
