
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generatePracticePlan } from '@/ai/flows/practice-plan-generator-flow';
import type { PracticePlanInput, PracticePlanOutput, PracticeDrill } from '@/ai/flows/practice-plan-generator-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Sparkles, Target, ListChecks, Clock, Dumbbell, Info } from 'lucide-react';
import { EQUIPMENT_SKILL_LEVELS, GOLF_IMPROVEMENT_AREAS } from '@/lib/constants'; // Using EQUIPMENT_SKILL_LEVELS for skill levels

const formSchema = z.object({
  improvementAreas: z.string().min(1, "Please list at least one area for improvement."), // Comma-separated string
  availableTimeMinutes: z.coerce.number().optional().refine(val => val === undefined || val >= 15, { message: "Practice time should be at least 15 minutes."}),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  specificGoals: z.string().optional(),
});

export function PracticePlanForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [practicePlan, setPracticePlan] = useState<PracticePlanOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      improvementAreas: '',
      availableTimeMinutes: undefined,
      skillLevel: undefined,
      specificGoals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPracticePlan(null);

    const improvementAreasArray = values.improvementAreas.split(',').map(area => area.trim()).filter(area => area.length > 0);
    if (improvementAreasArray.length === 0) {
        form.setError("improvementAreas", { type: "manual", message: "Please list at least one valid area for improvement."});
        setIsLoading(false);
        return;
    }

    const input: PracticePlanInput = {
      improvementAreas: improvementAreasArray,
      availableTimeMinutes: values.availableTimeMinutes,
      skillLevel: values.skillLevel,
      specificGoals: values.specificGoals,
    };

    try {
      const result = await generatePracticePlan(input);
      setPracticePlan(result);
      toast({
        title: 'Practice Plan Generated!',
        description: 'Your AI coach has created a personalized practice plan.',
      });
    } catch (error) {
      console.error('Error generating practice plan:', error);
      toast({
        title: 'Plan Generation Error',
        description: 'Could not generate practice plan. Please try again.',
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
            <Target className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Create Your Practice Plan</CardTitle>
          </div>
          <CardDescription>
            Tell us what you want to work on, and our AI will generate a tailored practice session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="improvementAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas to Improve</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Driving accuracy, Short game, Putting consistency"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>List the parts of your game you want to focus on, separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="availableTimeMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Practice Time (Minutes, Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 60 or 90" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value,10))} />
                      </FormControl>
                      <FormDescription>How long do you have for this session?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Skill Level (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your skill level" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EQUIPMENT_SKILL_LEVELS.filter(level => level.value !== 'professional').map(level => ( // Exclude 'professional' for practice plans for now
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Helps tailor drill complexity.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="specificGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Goals (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Hit 50% fairways in practice, make 10 consecutive 5-foot putts"
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Any measurable targets for this practice session?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Plan...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Generate Practice Plan</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">AI coach is crafting your practice plan...</p>
        </div>
      )}

      {practicePlan && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
               <ListChecks className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">{practicePlan.planTitle}</CardTitle>
            </div>
            {practicePlan.totalEstimatedTimeMinutes && (
                <CardDescription className="flex items-center gap-1">
                    <Clock className="h-4 w-4"/> Estimated Duration: {practicePlan.totalEstimatedTimeMinutes} minutes
                </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {practicePlan.warmUp && (
                <InfoDisplayCard title="Warm-up Suggestion" icon={<Dumbbell className="h-5 w-5 text-primary/80"/>} content={practicePlan.warmUp}/>
            )}

            {practicePlan.drills && practicePlan.drills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-primary mb-3 flex items-center"><Target className="mr-2 h-5 w-5"/>Practice Drills</h3>
                <Accordion type="single" collapsible className="w-full" defaultValue={`drill-0`}>
                  {practicePlan.drills.map((drill, index) => (
                    <AccordionItem value={`drill-${index}`} key={`drill-${index}`}>
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        {drill.name} 
                        {drill.durationMinutes && <span className="text-sm font-normal text-muted-foreground ml-2">({drill.durationMinutes} min)</span>}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 space-y-2 text-muted-foreground">
                        <p>{drill.description}</p>
                        <p className="text-xs"><span className="font-semibold text-primary">Focus:</span> {drill.focusArea}</p>
                        {drill.equipmentNeeded && drill.equipmentNeeded.length > 0 && (
                             <p className="text-xs"><span className="font-semibold text-primary">Equipment:</span> {drill.equipmentNeeded.join(', ')}</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
            
            {practicePlan.coolDown && (
                 <InfoDisplayCard title="Cool-down / Reflection" icon={<Info className="h-5 w-5 text-primary/80"/>} content={practicePlan.coolDown}/>
            )}

            {practicePlan.generalTips && (
              <Card className="bg-primary/10 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">General Practice Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary/90 whitespace-pre-line">{practicePlan.generalTips}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface InfoDisplayCardProps { title: string; content: string; icon?: React.ReactNode; }
const InfoDisplayCard: React.FC<InfoDisplayCardProps> = ({ title, content, icon }) => (
  <Card className="bg-background">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg text-primary flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground whitespace-pre-line">{content || "N/A"}</p>
    </CardContent>
  </Card>
);

