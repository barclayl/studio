
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { adviseOnFindingGolfBuddies } from '@/ai/flows/golf-buddy-advisor-flow';
import type { GolfBuddyAdvisorInput, GolfBuddyAdvisorOutput, GolfBuddySuggestion } from '@/ai/flows/golf-buddy-advisor-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Sparkles, Users, Lightbulb, ClipboardCopy, ShieldAlert, MessageSquareText } from 'lucide-react';
import { 
  USER_SKILL_LEVELS_WITH_ANY, 
  PLAYING_FREQUENCY_OPTIONS, 
  GAME_TYPE_PREFERENCE_OPTIONS,
  AGE_GROUP_PREFERENCE_OPTIONS 
} from '@/lib/constants';

const formSchema = z.object({
  location: z.string().min(3, "Please specify your city or region."),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'any'], { required_error: "Skill level is required."}),
  playingFrequency: z.string().optional(),
  gameTypePreference: z.string().optional(),
  ageGroupPreference: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export function GolfBuddyAdvisorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<GolfBuddyAdvisorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      skillLevel: undefined,
      playingFrequency: '',
      gameTypePreference: '',
      ageGroupPreference: '',
      additionalInfo: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAdvice(null);
    try {
      const result = await adviseOnFindingGolfBuddies(values as GolfBuddyAdvisorInput);
      setAdvice(result);
      toast({
        title: 'Golf Buddy Advice Ready!',
        description: 'AI has prepared some suggestions for you.',
      });
    } catch (error) {
      console.error('Error getting golf buddy advice:', error);
      toast({
        title: 'Advice Error',
        description: 'Could not get golf buddy advice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopyLfgPost = () => {
    if (advice?.customLfgPostDraft) {
      navigator.clipboard.writeText(advice.customLfgPostDraft)
        .then(() => {
          toast({ title: 'LFG Post Copied!', description: 'You can now paste it into social media or forums.' });
        })
        .catch(err => {
          console.error('Failed to copy LFG post:', err);
          toast({ title: 'Copy Failed', description: 'Could not copy text. Please try manually.', variant: 'destructive' });
        });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Golf Buddy Preferences</CardTitle>
          </div>
          <CardDescription>
            Tell us about yourself and what you're looking for in a golf buddy or group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location (City/Region)</FormLabel>
                    <FormControl><Input placeholder="e.g., San Francisco Bay Area, CA" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Skill Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your skill level" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {USER_SKILL_LEVELS_WITH_ANY.map(level => (
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="playingFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Playing Frequency (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="How often you play/want to play" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="">Any Frequency</SelectItem>
                          {PLAYING_FREQUENCY_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="gameTypePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Game Type (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="What kind of games?" /></SelectTrigger></FormControl>
                        <SelectContent>
                           <SelectItem value="">Any Game Type</SelectItem>
                          {GAME_TYPE_PREFERENCE_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ageGroupPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Group Preference (Optional)</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Preferred age group of buddies" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {AGE_GROUP_PREFERENCE_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Preferences or Info (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Enjoy a beer after the round', 'Early bird golfer', 'Looking for serious players to improve with', 'Prefer walking over riding a cart'."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Anything else that would help find a good match?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Getting Advice...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Get Buddy Finding Advice</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">AI is crafting your golf buddy advice...</p>
        </div>
      )}

      {advice && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500 max-w-3xl mx-auto">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
               <Lightbulb className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">Your Golf Buddy Advisor Results</CardTitle>
            </div>
            {advice.introduction && <CardDescription>{advice.introduction}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            {advice.suggestions && advice.suggestions.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-primary mb-3">Suggestions for Finding Golf Buddies</h3>
                <Accordion type="single" collapsible className="w-full" defaultValue="suggestion-0">
                  {advice.suggestions.map((item, index) => (
                    <AccordionItem value={`suggestion-${index}`} key={`suggestion-${index}`}>
                      <AccordionTrigger className="text-lg hover:no-underline">
                        {item.category}: {item.suggestion}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 text-sm text-muted-foreground">
                        {item.details || "No additional details provided."}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
            
            {advice.customLfgPostDraft && (
              <Card className="bg-background border">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <MessageSquareText className="h-5 w-5"/> Draft "Looking for Golf Buddy" Post
                  </CardTitle>
                  <CardDescription>You can copy, personalize, and share this on social media or forums.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    readOnly
                    value={advice.customLfgPostDraft}
                    className="resize-none h-48 bg-muted/30"
                    aria-label="Draft LFG Post"
                  />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCopyLfgPost} variant="outline">
                        <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Post
                    </Button>
                </CardFooter>
              </Card>
            )}

            {advice.safetyTips && advice.safetyTips.length > 0 && (
              <Card className="bg-destructive/10 border-destructive">
                <CardHeader>
                  <CardTitle className="text-xl text-destructive-foreground flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5"/> Safety Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-destructive-foreground/90">
                    {advice.safetyTips.map((tip, index) => (
                      <li key={`safety-${index}`}>{tip}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {advice.closingRemark && <p className="text-center text-muted-foreground pt-4">{advice.closingRemark}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
