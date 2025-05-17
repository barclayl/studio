
'use server';
/**
 * @fileOverview An AI agent for analyzing a golfer's round and providing improvement suggestions.
 *
 * - analyzeRound - A function that analyzes scorecard data and self-assessment.
 * - PostRoundAnalysisInput - The input type for the analyzeRound function.
 * - PostRoundAnalysisOutput - The return type for the analyzeRound function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
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

// Helper to create a string representation of the scorecard for the prompt
const formatScorecardForPrompt = (scorecard: ScorecardHole[]): string => {
  let table = "Hole | Par | Score | Putts\n-----|-----|-------|------\n";
  scorecard.forEach(h => {
    table += `${h.hole.toString().padEnd(4)} | ${h.par.toString().padEnd(3)} | ${(h.score ?? '-').toString().padEnd(5)} | ${(h.putts ?? '-').toString().padEnd(5)}\n`;
  });
  const totalScore = scorecard.reduce((sum, h) => sum + (h.score ?? 0), 0);
  const totalPar = scorecard.reduce((sum, h) => sum + h.par, 0);
  const totalPutts = scorecard.reduce((sum, h) => sum + (h.putts ?? 0), 0);
  table += `\nTotal Score: ${totalScore} (Par: ${totalPar}, To Par: ${totalScore - totalPar >= 0 ? '+' : ''}${totalScore - totalPar})\n`;
  table += `Total Putts: ${totalPutts}\n`;
  return table;
};


const prompt = ai.definePrompt({
  name: 'postRoundAnalysisPrompt',
  input: {schema: PostRoundAnalysisInputSchema},
  output: {schema: PostRoundAnalysisOutputSchema},
  prompt: `You are an expert golf performance analyst and coach.
Analyze the provided golf round data and the golfer's self-assessment to provide actionable insights and an improvement plan.

Scorecard Data:
{{{formatScorecardForPrompt scorecard}}}

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
    // The formatScorecardForPrompt function needs to be accessible within the prompt templating.
    // Genkit prompts can use Handlebars helpers. Let's register it.
    // However, direct function calls within prompt template like `{{{formatScorecardForPrompt scorecard}}}`
    // might not work as expected without specific Handlebars helper registration in Genkit.
    // For simplicity, we'll pass the formatted string directly if direct helper usage is complex.
    // Or, the LLM can be instructed to interpret the JSON structure of the scorecard directly.

    // Alternative: Pass scorecard as JSON and let the model interpret it, or pre-process.
    // For now, we'll rely on the LLM to understand the JSON structure from the schema.
    // The prompt string above will use 'scorecard' directly and the LLM should be smart enough.
    // Let's adjust the prompt slightly for clarity if not using a helper.
    // The prompt: `Scorecard Data (JSON):\n{{{JSONstringify scorecard}}}` could be an option.
    // For robust display, let's assume the model can interpret the structure.

    // To use formatScorecardForPrompt, it would typically be registered as a Handlebars helper.
    // Since that's more involved with Genkit's setup, we'll rely on the detailed Zod schema description
    // and direct JSON representation for the LLM. The prompt has been written to guide the LLM
    // to interpret the `scorecard` field based on its schema.
    // A simpler way for the prompt if not using helpers:
    // Scorecard: (Each item: hole, par, score, putts)
    // {{#each scorecard}}
    // Hole {{hole}}: Par {{par}}, Score {{score}}, Putts {{putts}}
    // {{/each}}
    // This is better for Handlebars. I will update the prompt part.

    const customInput = {
        ...input,
        // If we pre-format, pass it as a new field.
        // formattedScorecard: formatScorecardForPrompt(input.scorecard) // And use {{formattedScorecard}} in prompt
    };

    const {output} = await prompt(customInput); // or just input if not pre-formatting
    return output!;
  }
);
// Helper registration for Handlebars (conceptual, actual registration depends on Genkit's Handlebars instance)
// This is more advanced and typically not done directly in the flow file without specific Genkit APIs.
// For now, the prompt template will use Handlebars' #each block.
// No, the `JSONstringify` or direct object passing with clear schema description is the Genkit way.
// The prompt has been updated to instruct the LLM on how to interpret the `scorecard` array of objects.
// Let's re-verify the prompt structure for scorecard.
// The current prompt is `Scorecard Data:\n{{{formatScorecardForPrompt scorecard}}}`. This implies `formatScorecardForPrompt` is a global Handlebars helper.
// This is unlikely to be pre-registered.
// The most straightforward way for Genkit is to pass the raw data and let the model understand it via schema or use basic Handlebars.
// Let's change the prompt to use #each for the scorecard.

const updatedPrompt = ai.definePrompt({
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
    const {output} = await updatedPrompt(input);
    return output!;
  }
);


