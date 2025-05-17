
'use server';
/**
 * @fileOverview An AI agent for providing golf mental game coaching.
 *
 * - getMentalGameAdvice - A function that provides advice for a described mental challenge.
 * - MentalGameCoachInput - The input type for the getMentalGameAdvice function.
 * - MentalGameCoachOutput - The return type for the getMentalGameAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentalExerciseSchema = z.object({
  name: z.string().describe('The name of the mental exercise or technique.'),
  description: z.string().describe('A brief explanation of how to perform the exercise or apply the technique.'),
});

const MentalGameCoachInputSchema = z.object({
  mentalChallengeDescription: z.string().describe("A description of the mental game challenge the golfer is facing, e.g., 'I get very nervous on the first tee and often hit a bad shot.', 'I struggle to recover mentally after a couple of bad holes.'"),
  context: z.string().optional().describe("Any additional context, like when this issue occurs, or what the golfer has tried so far."),
});
export type MentalGameCoachInput = z.infer<typeof MentalGameCoachInputSchema>;

const MentalGameCoachOutputSchema = z.object({
  analysisOfChallenge: z.string().describe("The AI's understanding and analysis of the described mental challenge."),
  copingStrategies: z.array(z.string()).describe('Actionable coping strategies the golfer can use.'),
  mentalExercises: z.array(MentalExerciseSchema).describe('Specific mental exercises or visualization techniques recommended.'),
  positiveAffirmations: z.array(z.string()).describe('A list of positive affirmations relevant to the challenge.'),
  preRoundRoutineTips: z.string().optional().describe('Tips for a pre-round mental preparation routine, if applicable.'),
  inRoundFocusTips: z.string().optional().describe('Tips for maintaining focus and composure during the round, if applicable.'),
  summaryAdvice: z.string().describe('A concise summary of the key advice.'),
});
export type MentalGameCoachOutput = z.infer<typeof MentalGameCoachOutputSchema>;

export async function getMentalGameAdvice(input: MentalGameCoachInput): Promise<MentalGameCoachOutput> {
  return mentalGameCoachFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentalGameCoachPrompt',
  input: {schema: MentalGameCoachInputSchema},
  output: {schema: MentalGameCoachOutputSchema},
  prompt: `You are an experienced and empathetic golf psychologist and mental game coach.
A golfer is seeking advice for the following mental challenge:
"{{mentalChallengeDescription}}"

{{#if context}}Additional context provided: "{{context}}"{{/if}}

Your task is to provide comprehensive and actionable advice. Please include:
1.  An analysis of the challenge: Briefly explain the common psychological factors at play.
2.  Coping Strategies: Suggest 2-3 practical strategies the golfer can implement before, during, or after a round to manage this challenge.
3.  Mental Exercises: Recommend 1-2 mental exercises, visualization techniques, or mindfulness practices. For each, provide a name and a brief description.
4.  Positive Affirmations: Offer 2-3 positive affirmations the golfer can use.
5.  Pre-Round Routine Tips (Optional): If relevant, provide tips for their pre-round mental prep.
6.  In-Round Focus Tips (Optional): If relevant, provide tips for maintaining focus and composure during play.
7.  Summary Advice: A concise summary of your most important recommendations.

Be supportive, understanding, and practical in your response.
Ensure your output is a JSON object strictly matching the defined output schema.
`,
});

const mentalGameCoachFlow = ai.defineFlow(
  {
    name: 'mentalGameCoachFlow',
    inputSchema: MentalGameCoachInputSchema,
    outputSchema: MentalGameCoachOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
