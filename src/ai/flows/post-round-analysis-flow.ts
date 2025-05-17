
'use server';
/**
 * @fileOverview An AI agent for analyzing a golfer's round and providing improvement suggestions.
 *
 * - analyzeRound - A function that analyzes scorecard data and self-assessment.
 * - PostRoundAnalysisInput - The input type for the analyzeRound function.
 * - PostRoundAnalysisOutput - The return type for the analyzeRound function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';
import type { ScorecardHole } from '@/lib/types'; // Assuming ScorecardHole is defined here

// Define Zod schema for ScorecardHole if not already globally available and imported
// For this example, we assume ScorecardHole from '@/lib/types' is compatible or we redefine it.
const ScorecardHoleSchema = z.object({
  hole: z.number().describe('Hole number'),
  score: z.number().nullable().describe('Score for the hole'),
  putts: z.number().nullable().describe('Putts for the hole'),
  par: z.number().describe('Par for the hole'),
});

const StatisticalHighlightSchema = z.object({
  stat: z.string().describe('The name of the statistic being highlighted (e.g., "Scoring Average", "Putts per Green Hit").'),
  value: z.string().describe('The calculated value of the statistic (e.g., "4.5", "1.8").'),
  insight: z.string().describe('A brief insight or comment about this statistic in the context of the round.'),
});

const PersonalizedDrillSchema = z.object({
  name: z.string().describe('The name of the suggested practice drill.'),
  description: z.string().describe('A brief description of how to perform the drill.'),
  focusArea: z.string().describe('The specific area of the game this drill targets (e.g., "Driving Accuracy", "Short Putt Consistency").'),
});

const PostRoundAnalysisInputSchema = z.object({
  scorecard: z.array(ScorecardHoleSchema).describe('An array of objects, each representing a hole played, including hole number, score, putts, and par.'),
  fairwaysHit: z.number().optional().describe('Number of fairways hit in regulation (typically out of 14 for courses with 4 par 3s).'),
  greensInRegulation: z.number().optional().describe('Number of greens hit in regulation.'),
  sandSaves: z.number().optional().describe('Number of successful sand saves.'),
  upAndDowns: z.number().optional().describe('Number of successful up-and-downs from off the green.'),
  selfAssessment: z.string().describe("The golfer's subjective feedback on their round, e.g., 'My driving was inconsistent, but I putted well inside 10 feet.'"),
});
export type PostRoundAnalysisInput = z.infer<typeof PostRoundAnalysisInputSchema>;

const PostRoundAnalysisOutputSchema = z.object({
  overallScoreAnalysis: z.string().describe("A summary of the total score relative to par and general performance."),
  keyStrengths: z.array(z.string()).describe('Identified key strengths from this round based on data and self-assessment.'),
  areasForImprovement: z.array(z.string()).describe('Identified primary areas needing improvement.'),
  statisticalHighlights: z.array(StatisticalHighlightSchema).describe('A few key statistical highlights with insights.'),
  personalizedDrills: z.array(PersonalizedDrillSchema).describe('Specific practice drills recommended to target weaknesses.'),
  nextRoundFocus: z.string().describe('A concise key focus point or mental tip for the next round.'),
});
export type PostRoundAnalysisOutput = z.infer<typeof PostRoundAnalysisOutputSchema>;

export async function analyzeRound(input: PostRoundAnalysisInput): Promise<PostRoundAnalysisOutput> {
  return postRoundAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'postRoundAnalysisPrompt',
  input: {schema: PostRoundAnalysisInputSchema},
  output: {schema: PostRoundAnalysisOutputSchema},
  prompt: `You are an expert golf performance analyst and coach.
Analyze the provided golf round data and the golfer's self-assessment to provide actionable insights and an improvement plan.

Scorecard Data:
Hole | Par | Score | Putts
-----|-----|-------|------
{{#each scorecard}}
{{this.hole}} | {{this.par}} | {{this.score}} | {{this.putts}}
{{/each}}

Additional Stats:
{{#if fairwaysHit}}Fairways Hit: {{fairwaysHit}} (assume out of 14 driveable holes unless specified otherwise){{/if}}
{{#if greensInRegulation}}Greens in Regulation: {{greensInRegulation}} / 18{{/if}}
{{#if sandSaves}}Sand Saves: {{sandSaves}}{{/if}}
{{#if upAndDowns}}Up and Downs: {{upAndDowns}}{{/if}}

Golfer's Self-Assessment:
"{{selfAssessment}}"

Based on all this information:
1.  Provide an 'overallScoreAnalysis' summarizing the performance relative to par and any general trends.
2.  Identify 2-3 'keyStrengths' demonstrated in this round.
3.  Pinpoint 2-3 primary 'areasForImprovement'.
4.  List 2-4 'statisticalHighlights'. For each, include the stat name, its value, and a brief insight. Examples: "Birdie Conversion", "Putting Average on GIRs", "Scramble Success Rate". If specific stats like GIRs/Fairways are not provided, make general observations based on score and putts per hole.
5.  Suggest 2-3 'personalizedDrills' to address the identified weaknesses. For each drill, provide its name, a brief description, and the focus area.
6.  Offer a concise 'nextRoundFocus' - one key mental or strategic tip for the golfer to concentrate on in their next round.

Be constructive and encouraging.
Ensure your output is a JSON object strictly matching the defined output schema.
`,
});

const postRoundAnalysisFlow = ai.defineFlow(
  {
    name: 'postRoundAnalysisFlow',
    inputSchema: PostRoundAnalysisInputSchema,
    outputSchema: PostRoundAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
