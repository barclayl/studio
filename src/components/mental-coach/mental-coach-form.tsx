
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getMentalGameAdvice } from '@/ai/flows/mental-game-coach-flow';
import type { MentalGameCoachInput, MentalGameCoachOutput } from '@/ai/flows/mental-game-coach-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Sparkles, Brain, Lightbulb, CheckSquare, MessageCircle, ShieldQuestion } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  mentalChallengeDescription: z.string().min(10, "Please describe your challenge in at least 10 characters."),
  context: z.string().optional(),
});

export function MentalCoachForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<MentalGameCoachOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mentalChallengeDescription: '',
      context: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAdvice(null);
    try {
      const result = await getMentalGameAdvice(values as MentalGameCoachInput);
      setAdvice(result);
      toast({
        title: 'Mental Game Advice Ready!',
        description: 'Your AI coach has prepared personalized tips.',
      });
    } catch (error) {
      console.error('Error getting mental game advice:', error);
      toast({
        title: 'Advice Error',
        description: 'Could not get mental game advice. Please try again.',
        variant: 'destructive',
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
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Mental Game Consultation</CardTitle>
          </div>
          <CardDescription>
            Share your mental game struggles. Our AI coach will provide insights and strategies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="mentalChallengeDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe Your Mental Challenge</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I get very nervous on the first tee and often hit a bad shot.' or 'I struggle to recover mentally after a couple of bad holes.'"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Be specific about what you're experiencing.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Context (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'This usually happens in competitive rounds.' or 'I've tried deep breathing but it doesn't always help.'"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Any extra details that might be helpful for the AI.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Advice...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Mental Game Advice
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">AI coach is preparing your advice...</p>
        </div>
      )}

      {advice && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
               <Lightbulb className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">Your Personalized Mental Game Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                    <ShieldQuestion className="mr-2 h-5 w-5 text-primary/80"/>Analysis of Your Challenge
                </AccordionTrigger>
                <AccordionContent className="pt-2 text-muted-foreground">
                  {advice.analysisOfChallenge}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                    <CheckSquare className="mr-2 h-5 w-5 text-primary/80"/>Coping Strategies
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {advice.copingStrategies.map((strategy, index) => (
                      <li key={index}>{strategy}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {advice.mentalExercises && advice.mentalExercises.length > 0 && (
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                    <Brain className="mr-2 h-5 w-5 text-primary/80"/>Mental Exercises & Techniques
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 space-y-3">
                    {advice.mentalExercises.map((exercise, index) => (
                      <div key={index} className="p-3 border rounded-md bg-card/50">
                        <p className="font-semibold text-card-foreground">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">{exercise.description}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {advice.positiveAffirmations && advice.positiveAffirmations.length > 0 && (
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                    <MessageCircle className="mr-2 h-5 w-5 text-primary/80"/>Positive Affirmations
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {advice.positiveAffirmations.map((affirmation, index) => (
                        <li key={index}>{affirmation}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

             {advice.preRoundRoutineTips && (
                <AccordionItem value="item-5">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                        Pre-Round Routine Tips
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 text-muted-foreground">
                        {advice.preRoundRoutineTips}
                    </AccordionContent>
                </AccordionItem>
             )}

             {advice.inRoundFocusTips && (
                <AccordionItem value="item-6">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                        In-Round Focus Tips
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 text-muted-foreground">
                        {advice.inRoundFocusTips}
                    </AccordionContent>
                </AccordionItem>
             )}

            </Accordion>
            <Card className="mt-6 bg-primary/10 border-primary/30">
                <CardHeader>
                    <CardTitle className="text-xl text-primary">Summary Advice</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-primary/90">{advice.summaryAdvice}</p>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
