
'use server';
/**
 * @fileOverview An AI agent for advising users on how to find golf buddies.
 *
 * - adviseOnFindingGolfBuddies - A function that provides suggestions and a draft LFG post.
 * - GolfBuddyAdvisorInput - The input type for the function.
 * - GolfBuddyAdvisorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const GolfBuddyAdvisorInputSchema = z.object({
  location: z.string().min(3, "Please specify your city or region.").describe("User's city, state, or general region for finding golf buddies."),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'any'], { required_error: "Skill level is required."}).describe("Golfer's approximate skill level."),
  playingFrequency: z.string().optional().describe("How often the user typically plays or wants to play (e.g., 'weekends only', '2-3 times a month', 'weekday afternoons')."),
  gameTypePreference: z.string().optional().describe("What kind of golf games or interactions the user is looking for (e.g., 'casual 18-hole rounds', 'competitive matches', 'driving range practice partner', 'social golf group for 9 holes')."),
  ageGroupPreference: z.string().optional().describe("Any preference for the age group of golf buddies (e.g., '20s-30s', '40s-50s', 'seniors', 'any age is fine')."),
  additionalInfo: z.string().optional().describe("Any other specific preferences or information the user wants to share, like specific interests (e.g., 'enjoys a beer after the round', 'focused on improvement'), availability details, or what they value in a golf buddy (e.g., 'punctuality', 'good etiquette', 'friendly banter')."),
});
export type GolfBuddyAdvisorInput = z.infer<typeof GolfBuddyAdvisorInputSchema>;

const GolfBuddySuggestionSchema = z.object({
  category: z.string().describe("The type or category of the suggestion (e.g., 'Local Golf Facilities', 'Online Communities', 'Organized Play', 'General Networking')."),
  suggestion: z.string().describe("The specific piece of advice or action item the user can take."),
  details: z.string().optional().describe("Further explanation, context, or examples for the suggestion. Can include plausible names of local resources if appropriate for the location, but acknowledge these are examples."),
});

const GolfBuddyAdvisorOutputSchema = z.object({
  introduction: z.string().describe("A brief, encouraging introductory statement for the advice provided."),
  suggestions: z.array(GolfBuddySuggestionSchema).min(3).describe("A list of 3-5 actionable suggestions to help the user find golf buddies, tailored to their input."),
  customLfgPostDraft: z.string().describe("A template 'Looking for Group/Buddy' post the user can adapt and use on social media or forums. This draft should be friendly, clearly state what the user is looking for based on their input preferences (location, skill, frequency, game type, etc.), and include a friendly call to action. Remind the user to personalize it."),
  safetyTips: z.array(z.string()).min(2).max(3).describe("A list of 2-3 general safety tips for meeting new people for activities like golf (e.g., meet in public places first, let someone know your plans)."),
  closingRemark: z.string().describe("A positive and encouraging closing remark."),
});
export type GolfBuddyAdvisorOutput = z.infer<typeof GolfBuddyAdvisorOutputSchema>;

export async function adviseOnFindingGolfBuddies(input: GolfBuddyAdvisorInput): Promise<GolfBuddyAdvisorOutput> {
  return golfBuddyAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'golfBuddyAdvisorPrompt',
  input: {schema: GolfBuddyAdvisorInputSchema},
  output: {schema: GolfBuddyAdvisorOutputSchema},
  prompt: `You are a friendly and helpful AI Golf Community Advisor. Your goal is to help a golfer find compatible golf buddies based on their preferences.

User's Preferences:
- Location: {{location}}
- Skill Level: {{skillLevel}}
{{#if playingFrequency}}- Desired Playing Frequency: "{{playingFrequency}}"{{/if}}
{{#if gameTypePreference}}- Preferred Game Type: "{{gameTypePreference}}"{{/if}}
{{#if ageGroupPreference}}- Age Group Preference: "{{ageGroupPreference}}"{{/if}}
{{#if additionalInfo}}- Other Information/Preferences: "{{additionalInfo}}"{{/if}}

Based on these preferences, please provide the following in a structured JSON output:
1.  'introduction': A short, welcoming, and encouraging message.
2.  'suggestions': An array of 3-5 diverse and actionable suggestions on how and where they might find golf buddies.
    -   For each suggestion, provide a 'category' (e.g., 'Local Golf Facilities', 'Online Communities', 'Organized Play', 'General Networking'), a 'suggestion' (the core advice), and optional 'details' (more context or examples, like "You could try the men's/ladies' club at a public course like 'Willow Creek Golf Course' if that's in their area, or search for '[Location] Golfers' on Facebook."). Be creative but realistic.
3.  'customLfgPostDraft': Craft a friendly and effective "Looking for Golf Buddy/Group" post that the user could copy, personalize, and share on social media or local forums. This draft should incorporate their key preferences (location, skill level, what they're looking for). It should include a call to action. Add a small note like "(Remember to review and personalize this before posting!)".
4.  'safetyTips': Provide 2-3 essential safety tips for meeting new people for golf (e.g., "Meet at the golf course or a public place for the first time.", "Let a friend or family member know your plans and who you're meeting.", "Trust your instincts.").
5.  'closingRemark': A brief, positive, and encouraging closing statement.

Focus on providing practical, safe, and genuinely helpful advice.
Ensure your output is a JSON object strictly matching the defined output schema.
`,
});

const golfBuddyAdvisorFlow = ai.defineFlow(
  {
    name: 'golfBuddyAdvisorFlow',
    inputSchema: GolfBuddyAdvisorInputSchema,
    outputSchema: GolfBuddyAdvisorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate advice. Please try again.");
    }
    // Ensure safety tips are always present, even if AI forgets
    if (!output.safetyTips || output.safetyTips.length === 0) {
        output.safetyTips = [
            "Meet at the golf course or another public place for the first few times.",
            "Let a friend or family member know your plans, including who you're meeting and where.",
            "Trust your instincts; if something feels off, it's okay to end the interaction."
        ];
    }
    return output;
  }
);

