
'use server';
/**
 * @fileOverview An AI agent for generating personalized golf practice plans.
 *
 * - generatePracticePlan - A function that creates a practice plan based on user inputs.
 * - PracticePlanInput - The input type for the generatePracticePlan function.
 * - PracticePlanOutput - The return type for the generatePracticePlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PracticeDrillSchema = z.object({
  name: z.string().describe('The name of the practice drill.'),
  description: z.string().describe('A step-by-step description of how to perform the drill.'),
  durationMinutes: z.number().optional().describe('Suggested duration for this drill in minutes.'),
  focusArea: z.string().describe('The primary golf skill this drill targets (e.g., Driving Accuracy, Putting Speed Control).'),
  equipmentNeeded: z.array(z.string()).optional().describe('List of equipment needed, if any (e.g., "Alignment sticks", "7 iron").'),
});

const PracticePlanInputSchema = z.object({
  improvementAreas: z.array(z.string()).min(1).describe('A list of specific areas the golfer wants to improve (e.g., "Driving accuracy", "Short game consistency", "Putting under pressure").'),
  availableTimeMinutes: z.number().optional().describe('Total available practice time in minutes (e.g., 60, 90, 120). If not provided, suggest a balanced session of around 60-90 minutes.'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('The golfer\'s current skill level. This helps in tailoring drill complexity.'),
  specificGoals: z.string().optional().describe('Any specific, measurable goals the golfer has for these areas (e.g., "Hit 7/10 fairways", "Reduce 3-putts to less than 2 per round").'),
});
export type PracticePlanInput = z.infer<typeof PracticePlanInputSchema>;

const PracticePlanOutputSchema = z.object({
  planTitle: z.string().describe('A catchy and descriptive title for the practice plan (e.g., "Targeted Driving & Short Game Tune-Up").'),
  totalEstimatedTimeMinutes: z.number().optional().describe('Total estimated time for the entire practice session in minutes.'),
  drills: z.array(PracticeDrillSchema).describe('A list of recommended practice drills, typically 3-5 drills depending on available time.'),
  warmUp: z.string().optional().describe('A brief suggestion for a warm-up routine before starting the drills.'),
  coolDown: z.string().optional().describe('A brief suggestion for a cool-down or reflection after the session.'),
  generalTips: z.string().optional().describe('Overall advice for making the practice session effective (e.g., "Focus on quality over quantity", "Track your progress").'),
});
export type PracticePlanOutput = z.infer<typeof PracticePlanOutputSchema>;

export async function generatePracticePlan(input: PracticePlanInput): Promise<PracticePlanOutput> {
  return practicePlanGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'practicePlanGeneratorPrompt',
  input: {schema: PracticePlanInputSchema},
  output: {schema: PracticePlanOutputSchema},
  prompt: `You are an expert golf coach specializing in creating effective practice plans.
A golfer needs a personalized practice plan based on the following information:

- Areas to Improve: {{#each improvementAreas}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if availableTimeMinutes}}- Available Practice Time: {{availableTimeMinutes}} minutes{{else}}- Available Practice Time: Not specified, suggest a 60-90 minute session.{{/if}}
{{#if skillLevel}}- Skill Level: {{skillLevel}}{{/if}}
{{#if specificGoals}}- Specific Goals: "{{specificGoals}}"{{/if}}

Your task is to generate a practice plan. Please include:
1.  A 'planTitle' that is descriptive and motivational.
2.  'totalEstimatedTimeMinutes' for the whole session. If user specified time, try to match it; otherwise, aim for 60-90 minutes.
3.  A list of 3-5 'drills'. For each drill:
    -   'name': Clear and concise.
    -   'description': Detailed, step-by-step instructions.
    -   'durationMinutes': Suggested time for this drill. Sum of drill durations should be close to totalEstimatedTimeMinutes.
    -   'focusArea': Link it back to one of the user's improvementAreas.
    -   'equipmentNeeded': (Optional) List any specific equipment.
4.  'warmUp': (Optional but recommended) A short warm-up routine.
5.  'coolDown': (Optional) A suggestion for post-practice.
6.  'generalTips': Actionable advice for making the practice effective.

Tailor the complexity and type of drills to the user's skill level if provided. If no skill level is given, assume intermediate.
Ensure the sum of drill durations aligns with the total estimated time.
Prioritize drills that address the specified 'improvementAreas' and 'specificGoals'.
Be practical and encouraging.
Ensure your output is a JSON object strictly matching the defined output schema.
`,
});

const practicePlanGeneratorFlow = ai.defineFlow(
  {
    name: 'practicePlanGeneratorFlow',
    inputSchema: PracticePlanInputSchema,
    outputSchema: PracticePlanOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
