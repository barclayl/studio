
'use server';
/**
 * @fileOverview An AI agent for analyzing golf swings.
 *
 * - analyzeSwing - A function that analyzes a golf swing image and provides feedback.
 * - SwingAnalysisInput - The input type for the analyzeSwing function.
 * - SwingAnalysisOutput - The return type for the analyzeSwing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DrillSchema = z.object({
  name: z.string().describe('The name of the suggested drill.'),
  description: z.string().describe('A brief description of how to perform the drill.'),
});

const SwingAnalysisInputSchema = z.object({
  swingImageDataUri: z
    .string()
    .describe(
      "A still image of the golf swing (e.g., at address, top of backswing, or impact), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  commonIssues: z.string().optional().describe('Any common issues the golfer experiences, e.g., "slicing the ball", "poor contact", "lack of distance".'),
  currentClub: z.string().optional().describe('The club being used in the swing image, if relevant for the analysis.'),
});
export type SwingAnalysisInput = z.infer<typeof SwingAnalysisInputSchema>;

const SwingAnalysisOutputSchema = z.object({
  postureFeedback: z.string().describe("Feedback on the golfer's posture."),
  gripFeedback: z.string().describe("Feedback on the golfer's grip, if visible and relevant."),
  alignmentFeedback: z.string().describe("Feedback on the golfer's alignment to the target, if discernible."),
  ballPositionFeedback: z.string().describe("Feedback on the ball position relative to the stance."),
  swingPlaneFeedback: z.string().describe("Observations about the swing plane (e.g., too steep, too flat)."),
  tempoAndBalanceFeedback: z.string().describe("Comments on tempo and balance during the swing."),
  identifiedFaults: z.array(z.string()).describe('A list of key faults identified in the swing.'),
  suggestedDrills: z.array(DrillSchema).describe('Specific drills recommended to address the identified faults.'),
  overallSummary: z.string().describe('A concise overall summary of the swing analysis and key recommendations.'),
});
export type SwingAnalysisOutput = z.infer<typeof SwingAnalysisOutputSchema>;

export async function analyzeSwing(input: SwingAnalysisInput): Promise<SwingAnalysisOutput> {
  return swingAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'swingAnalysisPrompt',
  input: {schema: SwingAnalysisInputSchema},
  output: {schema: SwingAnalysisOutputSchema},
  prompt: `You are an expert golf teaching professional with years of experience analyzing swings.
Analyze the provided golf swing image and any common issues described by the user.

User's common issues: {{#if commonIssues}}"{{commonIssues}}"{{else}}"Not specified"{{/if}}
{{#if currentClub}}Club in use: "{{currentClub}}"{{/if}}
Swing Image: {{media url=swingImageDataUri}}

Provide detailed, constructive feedback covering the following aspects if discernible from the image:
- Posture: Stance width, spine angle, knee flex.
- Grip: Type of grip (if visible), pressure points (conceptual, as not visible).
- Alignment: Body alignment relative to the target line.
- Ball Position: Placement of the ball in relationto stance.
- Swing Plane: Path of the club during the swing.
- Tempo and Balance: Smoothness of motion and stability.

Identify 2-3 key faults based on your analysis.
For each fault, suggest 1-2 specific drills to help the golfer improve.
Conclude with an overall summary and the most important takeaway for the golfer.
Be encouraging and clear in your advice.
Ensure your output is a JSON object strictly matching the defined output schema.
`,
});

const swingAnalysisFlow = ai.defineFlow(
  {
    name: 'swingAnalysisFlow',
    inputSchema: SwingAnalysisInputSchema,
    outputSchema: SwingAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
