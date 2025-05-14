'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { optimalClubSelection } from '@/ai/flows/optimal-club-selection';
import type { OptimalClubSelectionInput, OptimalClubSelectionOutput } from '@/ai/flows/optimal-club-selection';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Sparkles, ThumbsUp, Info } from 'lucide-react';
import { SKILL_LEVELS } from '@/lib/constants';

const formSchema = z.object({
  gpsLocation: z.string().min(1, "GPS location is required."),
  weatherConditions: z.string().min(1, "Weather conditions are required."),
  userSkillLevel: z.string().min(1, "Skill level is required."),
  courseConditions: z.string().min(1, "Course conditions are required."),
  distanceToPin: z.coerce.number().min(1, "Distance to pin must be greater than 0."),
});

export function OptimalClubForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<OptimalClubSelectionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gpsLocation: '',
      weatherConditions: '',
      userSkillLevel: '',
      courseConditions: '',
      distanceToPin: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await optimalClubSelection(values as OptimalClubSelectionInput);
      setRecommendation(result);
      toast({
        title: "Recommendation Ready!",
        description: "We've found the optimal club for your shot.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error getting club recommendation:", error);
      toast({
        title: "Error",
        description: "Could not get club recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Optimal Club Selector</CardTitle>
          </div>
          <CardDescription>
            Provide details about your current shot, and our AI caddie will suggest the best club.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="gpsLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPS Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 34.0522,-118.2437" {...field} />
                      </FormControl>
                      <FormDescription>Your current GPS coordinates.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weatherConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weather Conditions</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sunny, 75°F, 10 mph W wind" {...field} />
                      </FormControl>
                      <FormDescription>Current weather (temp, wind, etc.).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userSkillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Skill Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your skill level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SKILL_LEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Helps tailor the recommendation.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distanceToPin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distance to Pin (yards)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 150" {...field} />
                      </FormControl>
                      <FormDescription>The distance to your target.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="courseConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Firm fairways, wet greens, uphill lie, wind behind"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Lie, elevation changes, hazards, etc.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Recommendation...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Club Recommendation
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {recommendation && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
               <ThumbsUp className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">AI Caddie Suggests</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary">Recommended Club:</h3>
              <p className="text-xl font-bold text-accent">{recommendation.recommendedClub}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">Reasoning:</h3>
              <p className="text-muted-foreground">{recommendation.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
       {!isLoading && !recommendation && (
         <Card className="shadow-md bg-secondary/30 border-secondary">
           <CardHeader>
             <div className="flex items-center gap-2">
                <Info className="h-6 w-6 text-secondary-foreground" />
               <CardTitle className="text-xl text-secondary-foreground">Ready for your shot?</CardTitle>
             </div>
           </CardHeader>
           <CardContent>
             <p className="text-secondary-foreground/80">
               Fill out the form above to get a personalized club recommendation from our AI caddie.
             </p>
           </CardContent>
         </Card>
       )}
    </div>
  );
}
