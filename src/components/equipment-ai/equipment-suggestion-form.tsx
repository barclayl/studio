
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { suggestEquipment } from '@/ai/flows/equipment-suggestion-flow';
import type { EquipmentSuggestionInput, EquipmentSuggestionOutput, SuggestedEquipmentItem } from '@/ai/flows/equipment-suggestion-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Sparkles, Lightbulb, ShoppingBag, ListChecks } from 'lucide-react';
import { EQUIPMENT_SKILL_LEVELS, BUDGET_OPTIONS, EQUIPMENT_TYPES } from '@/lib/constants';

const formSchema = z.object({
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional'], { required_error: "Skill level is required." }),
  playingStyle: z.string().optional(),
  commonMissHits: z.string().optional(),
  budget: z.enum(['economy', 'mid-range', 'premium', 'no-limit']).optional(),
  equipmentType: z.string().min(1, "Equipment type is required."),
  specificPreferences: z.string().optional(),
});

export function EquipmentSuggestionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionResult, setSuggestionResult] = useState<EquipmentSuggestionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillLevel: undefined,
      playingStyle: '',
      commonMissHits: '',
      budget: undefined,
      equipmentType: '',
      specificPreferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestionResult(null);
    try {
      const result = await suggestEquipment(values as EquipmentSuggestionInput);
      setSuggestionResult(result);
      if (result.suggestedItems && result.suggestedItems.length > 0) {
        toast({
          title: 'Equipment Suggestions Ready!',
          description: `AI has found ${result.suggestedItems.length} item(s) for you.`,
        });
      } else {
         toast({
          title: 'Suggestions Processed',
          description: result.generalAdvice || "No specific items matched, but see general advice below.",
        });
      }
    } catch (error) {
      console.error('Error getting equipment suggestions:', error);
      toast({
        title: 'Suggestion Error',
        description: 'Could not get equipment suggestions. Please try again.',
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
            <ShoppingBag className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Equipment Recommendation</CardTitle>
          </div>
          <CardDescription>
            Tell us about your game and needs, and our AI will suggest suitable golf equipment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Skill Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your skill level" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EQUIPMENT_SKILL_LEVELS.map(level => (
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
                  name="equipmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Type Needed</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select equipment type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EQUIPMENT_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your budget range" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUDGET_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="playingStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Playing Style (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., Aggressive, focus on distance" {...field} /></FormControl>
                      <FormDescription>Describe how you typically play.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
             
              <FormField
                control={form.control}
                name="commonMissHits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Common Miss-Hits (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Slice with driver, thin irons" className="resize-none" rows={2} {...field} /></FormControl>
                     <FormDescription>What are your typical bad shots?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specificPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Preferences (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Prefer soft feel putter, need forgiving irons" className="resize-none" rows={2} {...field} /></FormControl>
                     <FormDescription>Any must-haves or strong preferences?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Getting Suggestions...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Get Equipment Suggestions</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">AI is searching for equipment...</p>
        </div>
      )}

      {suggestionResult && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">AI Equipment Advisor Says...</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {suggestionResult.suggestedItems && suggestionResult.suggestedItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestionResult.suggestedItems.map((item, index) => (
                  <EquipmentItemCard key={index} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No specific equipment items could be recommended based on your criteria. See general advice below.</p>
            )}

            {suggestionResult.generalAdvice && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">General Advice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary/90">{suggestionResult.generalAdvice}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface EquipmentItemCardProps {
  item: SuggestedEquipmentItem;
}

function EquipmentItemCard({ item }: EquipmentItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="relative w-full aspect-[3/2] bg-muted">
        <Image 
          src={item.imageUrl} 
          alt={`${item.brand} ${item.name}`} 
          layout="fill" 
          objectFit="contain"
          className="p-2"
          data-ai-hint={item.dataAiHint} 
        />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{item.brand} - {item.name}</CardTitle>
        <CardDescription>{item.type} {item.estimatedPriceRange && `- Est. ${item.estimatedPriceRange}`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <div>
          <h4 className="text-sm font-semibold text-primary flex items-center mb-1">
            <ListChecks className="mr-2 h-4 w-4" /> Key Features:
          </h4>
          <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
            {item.keyFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-primary flex items-center mb-1">
            <Sparkles className="mr-2 h-4 w-4 text-accent" /> Reasoning:
          </h4>
          <p className="text-xs italic text-muted-foreground">{item.reasoning}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-3">
        <Button variant="outline" className="w-full">More Info (Mock)</Button>
      </CardFooter>
    </Card>
  );
}

