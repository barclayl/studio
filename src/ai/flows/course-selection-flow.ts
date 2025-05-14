'use server';
/**
 * @fileOverview An AI agent for recommending golf courses.
 *
 * - selectCourse - A function that recommends courses based on user query and skill level.
 * - CourseSelectionInput - The input type for the selectCourse function.
 * - CourseSelectionOutput - The return type for the selectCourse function.
 */

import {ai}from '@/ai/genkit';
import {z}from 'genkit';
import type { Course as AppCourseType } from '@/lib/types';
import { MOCK_COURSES } from '@/lib/constants';

// Define the Zod schema for a single course in the output, matching AppCourseType
const CourseSchema = z.object({
  id: z.string().describe("A unique identifier for the course, e.g., 'course-1', 'mock-pebble-beach'."),
  name: z.string().describe("The full name of the golf course."),
  address: z.string().describe("The plausible physical address of the course."),
  distance: z.string().describe("Estimated distance from user or a general proximity, e.g., '15 miles', 'nearby', 'local gem'."),
  imageUrl: z.string().url().describe("A placeholder image URL for the course. ALWAYS use 'https://placehold.co/600x400.png'."),
  dataAiHint: z.string().describe("One or two keywords for the placeholder image, e.g., 'golf course scenic', 'championship green'."),
  details: z.string().describe("Detailed information about the course, its characteristics, designer, signature holes, why it's famous, typical challenges, suitability for the user."),
  reasoning: z.string().describe("Specific reasoning for recommending this course based on the user's query and skill level."),
});

const CourseSelectionInputSchema = z.object({
  searchQuery: z.string().describe("User's natural language query for courses, e.g., 'championship courses near Pebble Beach', 'courses for beginners in California'."),
  userSkillLevel: z.string().optional().describe("The skill level of the golfer, e.g., 'beginner', 'intermediate', 'advanced'. This is optional."),
});
export type CourseSelectionInput = z.infer<typeof CourseSelectionInputSchema>;

const CourseSelectionOutputSchema = z.object({
  recommendedCourses: z.array(CourseSchema).describe("A list of recommended golf courses. Should return up to 3 courses, or an empty list if no suitable courses are found."),
});
export type CourseSelectionOutput = z.infer<typeof CourseSelectionOutputSchema>;

export async function selectCourse(input: CourseSelectionInput): Promise<CourseSelectionOutput> {
  return courseSelectionFlow(input);
}

const mockCoursesString = MOCK_COURSES.map(course => `- ${course.name} at ${course.address}`).join('\n');

const prompt = ai.definePrompt({
  name: 'courseSelectionPrompt',
  input: {schema: CourseSelectionInputSchema},
  output: {schema: CourseSelectionOutputSchema},
  prompt: `You are an expert golf course concierge. Your task is to recommend suitable golf courses based on the user's query and skill level.

User's search query: "{{searchQuery}}"
{{#if userSkillLevel}}User's skill level: "{{userSkillLevel}}"{{/if}}

Your knowledge base includes these well-known courses (treat them as examples of real courses you know):
${mockCoursesString}

When a query specifically mentions one of these courses or locations near them, prioritize information consistent with these known courses. For other queries, or if more courses are needed, you can generate plausible details for other famous or fitting fictional courses.

Please provide a list of up to 3 recommended courses. For each course, you MUST include all fields defined in the output schema: id, name, address, distance, imageUrl, dataAiHint, details, and reasoning.
- For 'imageUrl', ALWAYS use 'https://placehold.co/600x400.png'.
- For 'id', create unique identifiers like 'course-1', 'course-2', or 'mock-xyz' if based on a known mock course.

If no courses match the query, return an empty list for "recommendedCourses".
Ensure your output is a JSON object strictly matching the defined output schema.
`,
});

const courseSelectionFlow = ai.defineFlow(
  {
    name: 'courseSelectionFlow',
    inputSchema: CourseSelectionInputSchema,
    outputSchema: CourseSelectionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return { recommendedCourses: output?.recommendedCourses || [] };
  }
);
