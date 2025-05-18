
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from "date-fns";
import { predictTeeTimes } from '@/ai/flows/tee-time-predictor-flow';
import type { TeeTimePredictorInput, TeeTimePredictorOutput, PredictedTeeTimeSlot } from '@/ai/flows/tee-time-predictor-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Sparkles, CalendarIcon, Info, AlertTriangle, CheckCircle, Users, Clock4, SunMedium } from 'lucide-react';
import { TIME_PREFERENCES, NUMBER_OF_PLAYERS_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  courseName: z.string().min(3, "Course name must be at least 3 characters."),
  location: z.string().min(3, "Location must be at least 3 characters (e.g., city, state)."),
  date: z.date({ required_error: "A date for playing is required."}),
  timePreference: z.string({ required_error: "Please select a time preference."}),
  numberOfPlayers: z.coerce.number().min(1).max(4),
  weatherForecast: z.string().optional(),
});

export function TeeTimePredictorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<TeeTimePredictorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: '',
      location: '',
      date: undefined,
      timePreference: undefined,
      numberOfPlayers: 2,
      weatherForecast: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPredictionResult(null);

    const inputForFlow: TeeTimePredictorInput = {
      ...values,
      date: format(values.date, "yyyy-MM-dd (EEEE)"), // Format date for AI
    };

    try {
      const result = await predictTeeTimes(inputForFlow);
      setPredictionResult(result);
      toast({
        title: 'Tee Time Prediction Ready!',
        description: 'AI has generated potential tee time availability.',
      });
    } catch (error) {
      console.error('Error getting tee time prediction:', error);
      toast({
        title: 'Prediction Error',
        description: 'Could not get tee time prediction. Please try again.',
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
            <CalendarIcon className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Tee Time Availability Predictor</CardTitle>
          </div>
          <CardDescription>
            Enter course details and preferences to get an AI prediction on tee time availability.
            This tool provides estimates, always confirm with the course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Pebble Beach Golf Links" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (City, State/Region)</FormLabel>
                      <FormControl><Input placeholder="e.g., Pebble Beach, CA" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setDate(new Date().getDate() -1)) // Disable past dates
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Preference</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select preferred time" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {TIME_PREFERENCES.map(option => (
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
                  name="numberOfPlayers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Players</FormLabel>
                       <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select number of players" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {NUMBER_OF_PLAYERS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={String(option.value)}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weatherForecast"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weather Forecast (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., Sunny, 75°F, light breeze" {...field} /></FormControl>
                      <FormDescription>Knowing the weather can help refine prediction.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Predicting Availability...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Predict Tee Times</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">AI is checking patterns and predicting availability...</p>
        </div>
      )}

      {predictionResult && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
               <Sparkles className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">Tee Time Prediction Results</CardTitle>
            </div>
            <CardDescription className="text-sm italic">
              For: {form.getValues('courseName')} on {form.getValues('date') ? format(form.getValues('date'), "PPP") : 'selected date'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5"/>Important Disclaimer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm">{predictionResult.importantDisclaimer}</p>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><Info className="mr-2 h-5 w-5"/>Overall Analysis</h3>
                <p className="text-muted-foreground">{predictionResult.overallAnalysis}</p>
            </div>
            
            {predictionResult.predictedTeeTimes && predictionResult.predictedTeeTimes.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-primary mb-3 flex items-center"><Clock4 className="mr-2 h-5 w-5"/>Predicted Tee Time Slots</h3>
                <Accordion type="single" collapsible className="w-full" defaultValue="slot-0">
                  {predictionResult.predictedTeeTimes.map((slot, index) => (
                    <AccordionItem value={`slot-${index}`} key={`slot-${index}`}>
                      <AccordionTrigger className="text-lg hover:no-underline flex justify-between items-center w-full">
                        <span className="font-semibold">{slot.time}</span>
                        <AvailabilityBadge level={slot.availabilityLevel} />
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 space-y-2 text-muted-foreground">
                        <p><span className="font-medium text-card-foreground">Reasoning:</span> {slot.reasoning}</p>
                        {slot.notes && <p><span className="font-medium text-card-foreground">Notes:</span> {slot.notes}</p>}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
            
            <div>
                <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><CheckCircle className="mr-2 h-5 w-5"/>Booking Advice</h3>
                <p className="text-muted-foreground">{predictionResult.bookingAdvice}</p>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}


const AvailabilityBadge: React.FC<{ level: PredictedTeeTimeSlot['availabilityLevel'] }> = ({ level }) => {
  let bgColor = 'bg-muted';
  let textColor = 'text-muted-foreground';
  let Icon = Info;

  switch (level) {
    case 'Very Likely Available':
      bgColor = 'bg-green-100 dark:bg-green-900';
      textColor = 'text-green-700 dark:text-green-300';
      Icon = CheckCircle;
      break;
    case 'Likely Available':
      bgColor = 'bg-emerald-100 dark:bg-emerald-900';
      textColor = 'text-emerald-700 dark:text-emerald-300';
      Icon = CheckCircle;
      break;
    case 'Moderately Likely':
      bgColor = 'bg-yellow-100 dark:bg-yellow-900';
      textColor = 'text-yellow-700 dark:text-yellow-400';
      Icon = SunMedium;
      break;
    case 'Less Likely':
      bgColor = 'bg-orange-100 dark:bg-orange-900';
      textColor = 'text-orange-700 dark:text-orange-400';
      Icon = AlertTriangle;
      break;
    case 'Very Unlikely / Booked':
      bgColor = 'bg-red-100 dark:bg-red-900';
      textColor = 'text-red-700 dark:text-red-400';
      Icon = AlertTriangle;
      break;
  }

  return (
    <span className={cn(
      "text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5",
      bgColor,
      textColor
    )}>
      <Icon className="h-3.5 w-3.5" />
      {level}
    </span>
  );
};

