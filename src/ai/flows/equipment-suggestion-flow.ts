
'use server';
/**
 * @fileOverview An AI agent for suggesting golf equipment.
 *
 * - suggestEquipment - A function that suggests equipment based on user profile and needs.
 * - EquipmentSuggestionInput - The input type for the suggestEquipment function.
 * - EquipmentSuggestionOutput - The return type for the suggestEquipment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedEquipmentItemSchema = z.object({
  brand: z.string().describe('The brand name of the equipment (e.g., Titleist, Callaway, TaylorMade).'),
  name: z.string().describe('The specific model name of the equipment (e.g., Pro V1, Rogue ST MAX Driver, Spider GT Putter).'),
  type: z.string().describe('The general type of equipment (e.g., Driver, Irons Set, Putter, Golf Ball, Wedge).'),
  description: z.string().describe('A brief description of the equipment and its suitability for the user.'),
  keyFeatures: z.array(z.string()).describe('A list of 2-4 key features or technologies of the equipment.'),
  reasoning: z.string().describe('Why this specific piece of equipment is recommended for the user based on their input.'),
  estimatedPriceRange: z.string().optional().describe("A plausible estimated price range, e.g., '$400-$500', 'Around $150', 'Premium'. This can be omitted if not easily determinable."),
  imageUrl: z.string().url().describe("A placeholder image URL for the equipment. ALWAYS use 'https://placehold.co/300x200.png'."),
  dataAiHint: z.string().describe("One or two keywords for the placeholder image, e.g., 'golf driver', 'iron set', 'putter modern'."),
});

const EquipmentSuggestionInputSchema = z.object({
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional']).describe('The golfer\'s skill level.'),
  playingStyle: z.string().optional().describe('The golfer\'s typical playing style (e.g., aggressive, conservative, focuses on distance, prioritizes accuracy).'),
  commonMissHits: z.string().optional().describe('Common miss-hits the golfer experiences (e.g., slice with driver, thin iron shots, pulls putts).'),
  budget: z.enum(['economy', 'mid-range', 'premium', 'no-limit']).optional().describe('The golfer\'s general budget for this equipment.'),
  equipmentType: z.string().describe('The specific type of equipment the user is looking for (e.g., "Driver", "Set of Irons", "Putter", "Golf Balls", "Wedges").'),
  specificPreferences: z.string().optional().describe('Any specific preferences the user has (e.g., "likes a soft feel on putter", "prefers forgiving irons", "looking for adjustable driver").'),
});
export type EquipmentSuggestionInput = z.infer<typeof EquipmentSuggestionInputSchema>;

const EquipmentSuggestionOutputSchema = z.object({
  suggestedItems: z.array(SuggestedEquipmentItemSchema).describe('A list of 1 to 3 recommended equipment items. Can be an empty list if no specific recommendation can be made.'),
  generalAdvice: z.string().optional().describe('Any general advice related to selecting this type of equipment or tips for trying it out.'),
});
export type EquipmentSuggestionOutput = z.infer<typeof EquipmentSuggestionOutputSchema>;

export async function suggestEquipment(input: EquipmentSuggestionInput): Promise<EquipmentSuggestionOutput> {
  return equipmentSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'equipmentSuggestionPrompt',
  input: {schema: EquipmentSuggestionInputSchema},
  output: {schema: EquipmentSuggestionOutputSchema},
  prompt: `You are an expert golf equipment advisor. Your goal is to recommend suitable golf equipment based on the user's profile and needs.

User Profile:
- Skill Level: {{skillLevel}}
{{#if playingStyle}}- Playing Style: "{{playingStyle}}"{{/if}}
{{#if commonMissHits}}- Common Miss-Hits: "{{commonMissHits}}"{{/if}}
{{#if budget}}- Budget: {{budget}}{{/if}}
- Equipment Type Needed: "{{equipmentType}}"
{{#if specificPreferences}}- Specific Preferences: "{{specificPreferences}}"{{/if}}

Based on this information, please provide 1 to 3 specific equipment recommendations. For each item, include:
- brand: The manufacturer's brand.
- name: The model name.
- type: The general type matching equipmentType.
- description: A brief overview of the item and its suitability.
- keyFeatures: 2-4 bullet points of its main features/technologies.
- reasoning: Why it's a good fit for this user.
- estimatedPriceRange: (Optional) A general price indication like '$100-$200' or 'Premium'.
- imageUrl: ALWAYS use 'https://placehold.co/300x200.png'.
- dataAiHint: One or two keywords for the image, related to the equipment type (e.g., 'golf driver', 'iron set').

Also, provide some 'generalAdvice' if applicable, such as tips for testing equipment or what to look for.
If you cannot make a specific recommendation, return an empty list for 'suggestedItems' and provide advice in 'generalAdvice'.
Ensure your output is a JSON object strictly matching the defined output schema.
`,
});

const equipmentSuggestionFlow = ai.defineFlow(
  {
    name: 'equipmentSuggestionFlow',
    inputSchema: EquipmentSuggestionInputSchema,
    outputSchema: EquipmentSuggestionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
