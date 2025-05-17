
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { analyzeRound } from '@/ai/flows/post-round-analysis-flow';
import type { PostRoundAnalysisInput, PostRoundAnalysisOutput, ScorecardHole } from '@/ai/flows/post-round-analysis-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2, Sparkles, BarChart3, ListChecks, TrendingUp, Target, Brain } from 'lucide-react';
import { INITIAL_SCORECARD } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const scorecardHoleSchema = z.object({
  hole: z.number(),
  par: z.coerce.number().min(3, "Par must be at least 3").max(5, "Par cannot exceed 5"),
  score: z.coerce.number().nullable().optional().transform(val => val === undefined ? null : val).refine(val => val === null || val >= 1, {message: "Score must be 1 or higher"}),
  putts: z.coerce.number().nullable().optional().transform(val => val === undefined ? null : val).refine(val => val === null || val >= 0, {message: "Putts cannot be negative"}),
});

const formSchema = z.object({
  scorecard: z.array(scorecardHoleSchema).length(18, "Please provide data for all 18 holes."),
  fairwaysHit: z.coerce.number().min(0).max(18).optional(), // Assuming max 18 potential fairways
  greensInRegulation: z.coerce.number().min(0).max(18).optional(),
  sandSaves: z.coerce.number().min(0).max(18).optional(), // Unlikely to have 18, but for flexibility
  upAndDowns: z.coerce.number().min(0).max(18).optional(), // Same as sand saves
  selfAssessment: z.string().min(10, "Please provide a brief self-assessment (min 10 characters)."),
});

export function PostRoundAnalysisForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PostRoundAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scorecard: INITIAL_SCORECARD.map(h => ({ ...h, score: null, putts: null })), // Ensure score/putts are null initially for coerce
      fairwaysHit: undefined,
      greensInRegulation: undefined,
      sandSaves: undefined,
      upAndDowns: undefined,
      selfAssessment: '',
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "scorecard",
  });

  const totalPar = form.watch('scorecard').reduce((sum, hole) => sum + (hole.par || 0), 0);
  const totalScore = form.watch('scorecard').reduce((sum, hole) => sum + (hole.score || 0), 0);
  const totalPutts = form.watch('scorecard').reduce((sum, hole) => sum + (hole.putts || 0), 0);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);

    // Ensure optional number fields are passed as numbers or undefined, not empty strings
    const inputData: PostRoundAnalysisInput = {
      ...values,
      fairwaysHit: values.fairwaysHit === undefined || isNaN(values.fairwaysHit) ? undefined : Number(values.fairwaysHit),
      greensInRegulation: values.greensInRegulation === undefined || isNaN(values.greensInRegulation) ? undefined : Number(values.greensInRegulation),
      sandSaves: values.sandSaves === undefined || isNaN(values.sandSaves) ? undefined : Number(values.sandSaves),
      upAndDowns: values.upAndDowns === undefined || isNaN(values.upAndDowns) ? undefined : Number(values.upAndDowns),
      scorecard: values.scorecard.map(h => ({
        ...h,
        score: h.score === null || h.score === undefined ? null : Number(h.score),
        putts: h.putts === null || h.putts === undefined ? null : Number(h.putts),
        par: Number(h.par)
      })) as ScorecardHole[], // Cast to ensure type compatibility after transformation
    };
    
    try {
      const result = await analyzeRound(inputData);
      setAnalysisResult(result);
      toast({
        title: 'Round Analysis Complete!',
        description: 'Your AI coach has analyzed your round.',
      });
    } catch (error) {
      console.error('Error getting round analysis:', error);
      toast({
        title: 'Analysis Error',
        description: 'Could not analyze round. Please try again.',
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
            <BarChart3 className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Analyze Your Round</CardTitle>
          </div>
          <CardDescription>
            Enter your scores, key stats, and a self-assessment for an AI-driven performance review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Scorecard Input Section */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary flex items-center"><ListChecks className="mr-2"/>Scorecard Data</h3>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px] text-center">Hole</TableHead>
                        <TableHead className="w-[80px] text-center">Par</TableHead>
                        <TableHead className="w-[80px] text-center">Score</TableHead>
                        <TableHead className="w-[80px] text-center">Putts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((item, index) => (
                        <TableRow key={item.id} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                          <TableCell className="font-medium text-center">{item.hole}</TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`scorecard.${index}.par`}
                              render={({ field }) => (
                                <Input type="number" {...field} className="text-center h-9" onChange={e => field.onChange(parseInt(e.target.value,10) || 0)} />
                              )}
                            />
                            <FormMessage>{form.formState.errors.scorecard?.[index]?.par?.message}</FormMessage>
                          </TableCell>
                           <TableCell>
                            <FormField
                              control={form.control}
                              name={`scorecard.${index}.score`}
                              render={({ field }) => (
                                <Input type="number" {...field} value={field.value === null ? '' : field.value} onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value,10))} className="text-center h-9" />
                              )}
                            />
                            <FormMessage>{form.formState.errors.scorecard?.[index]?.score?.message}</FormMessage>
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`scorecard.${index}.putts`}
                              render={({ field }) => (
                                <Input type="number" {...field} value={field.value === null ? '' : field.value} onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value,10))} className="text-center h-9" />
                              )}
                            />
                             <FormMessage>{form.formState.errors.scorecard?.[index]?.putts?.message}</FormMessage>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                     <TableFooter>
                      <TableRow className="bg-primary/10 font-semibold">
                        <TableHead className="text-right text-primary">Totals:</TableHead>
                        <TableHead className="text-center text-primary">{totalPar}</TableHead>
                        <TableHead className="text-center text-primary">{totalScore}</TableHead>
                        <TableHead className="text-center text-primary">{totalPutts}</TableHead>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
                 {form.formState.errors.scorecard && <FormMessage className="mt-2">{form.formState.errors.scorecard.message || form.formState.errors.scorecard.root?.message}</FormMessage>}
              </div>

              {/* Additional Stats Section */}
              <div>
                 <h3 className="text-xl font-semibold mb-3 text-primary">Additional Stats (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField control={form.control} name="fairwaysHit" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fairways Hit</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 9" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value,10))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="greensInRegulation" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Greens in Reg.</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 12" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value,10))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="sandSaves" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sand Saves</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 2" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value,10))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="upAndDowns" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Up & Downs</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 3" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value,10))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="selfAssessment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Self-Assessment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'My driving was inconsistent, but I putted well inside 10 feet.'"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Your subjective feedback on your round.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Round...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Round Analysis
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
          <p className="mt-4 text-muted-foreground">AI is analyzing your round details...</p>
        </div>
      )}

      {analysisResult && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <CardHeader>
             <div className="flex items-center gap-2 mb-2">
               <TrendingUp className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">Post-Round Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoDisplayCard title="Overall Score Analysis" content={analysisResult.overallScoreAnalysis} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Key Strengths</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {analysisResult.keyStrengths.map((item, idx) => <li key={`strength-${idx}`}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Areas for Improvement</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {analysisResult.areasForImprovement.map((item, idx) => <li key={`improve-${idx}`}>{item}</li>)}
                    </ul>
                </div>
            </div>
            
            {analysisResult.statisticalHighlights && analysisResult.statisticalHighlights.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-primary mb-3">Statistical Highlights</h3>
                 <Accordion type="single" collapsible className="w-full">
                  {analysisResult.statisticalHighlights.map((highlight, index) => (
                    <AccordionItem value={`stat-${index}`} key={`stat-${index}`}>
                      <AccordionTrigger className="text-md hover:no-underline">
                        {highlight.stat}: <span className="text-accent ml-2">{highlight.value}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">{highlight.insight}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {analysisResult.personalizedDrills && analysisResult.personalizedDrills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-primary mb-3 flex items-center"><Target className="mr-2 h-5 w-5"/>Personalized Drills</h3>
                <div className="space-y-4">
                {analysisResult.personalizedDrills.map((drill, index) => (
                  <Card key={`drill-${index}`} className="bg-card/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{drill.name}</CardTitle>
                       <CardDescription className="text-xs">Focus Area: {drill.focusArea}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{drill.description}</p>
                    </CardContent>
                  </Card>
                ))}
                </div>
              </div>
            )}
            
            <Card className="bg-primary/10 border-primary/30">
                <CardHeader>
                    <CardTitle className="text-xl text-primary flex items-center"><Brain className="mr-2"/>Next Round Focus</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-primary/90">{analysisResult.nextRoundFocus}</p>
                </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface InfoDisplayCardProps { title: string; content: string; }
const InfoDisplayCard: React.FC<InfoDisplayCardProps> = ({ title, content }) => (
  <Card className="bg-background">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg text-primary">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{content || "N/A"}</p>
    </CardContent>
  </Card>
);

