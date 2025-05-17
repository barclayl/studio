
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { analyzeSwing } from '@/ai/flows/swing-analysis-flow';
import type { SwingAnalysisInput, SwingAnalysisOutput } from '@/ai/flows/swing-analysis-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Loader2, Sparkles, CameraIcon, UploadCloud, Lightbulb, BarChartIcon, CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
  swingImageDataUri: z.string().refine(val => val.startsWith('data:image/'), {
    message: 'Please upload a valid image file (PNG, JPG, GIF, WebP).',
  }),
  commonIssues: z.string().optional(),
  currentClub: z.string().optional(),
});

export function SwingAnalysisForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SwingAnalysisOutput | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      swingImageDataUri: '',
      commonIssues: '',
      currentClub: '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        form.setError('swingImageDataUri', {
          type: 'manual',
          message: 'Invalid file type. Please upload an image.',
        });
        setPreviewImage(null);
        form.setValue('swingImageDataUri', '');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        form.setValue('swingImageDataUri', result, { shouldValidate: true });
         form.clearErrors('swingImageDataUri');
      };
      reader.onerror = () => {
        form.setError('swingImageDataUri', {
          type: 'manual',
          message: 'Failed to read image file.',
        });
        setPreviewImage(null);
        form.setValue('swingImageDataUri', '');
      }
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      form.setValue('swingImageDataUri', '');
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.swingImageDataUri) {
      form.setError('swingImageDataUri', { type: 'manual', message: 'Swing image is required.' });
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeSwing(values as SwingAnalysisInput);
      setAnalysisResult(result);
      toast({
        title: 'Swing Analysis Complete!',
        description: 'Your AI coach has provided feedback.',
      });
    } catch (error) {
      console.error('Error getting swing analysis:', error);
      toast({
        title: 'Analysis Error',
        description: 'Could not analyze swing. Please try again.',
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
            <CameraIcon className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Analyze Your Swing</CardTitle>
          </div>
          <CardDescription>
            Upload an image of your golf swing. Our AI will analyze it and provide actionable feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="swingImageDataUri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Swing Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center space-y-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <UploadCloud className="mr-2 h-4 w-4" />
                          {previewImage ? 'Change Image' : 'Upload Swing Image'}
                        </Button>
                        <Input
                          type="file"
                          accept="image/png, image/jpeg, image/gif, image/webp"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleImageChange}
                          aria-label="Upload swing image"
                        />
                        {previewImage && (
                          <div className="mt-4 p-2 border rounded-md max-w-sm mx-auto">
                            <Image src={previewImage} alt="Swing preview" width={300} height={200} className="rounded-md object-contain aspect-video" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Capture your swing at address, top, or impact. Clear images work best.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commonIssues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Common Issues (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Slicing the ball, poor contact, lack of distance..."
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Describe any recurring problems with your swing.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentClub"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Used (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 7 Iron, Driver" {...field} />
                    </FormControl>
                    <FormDescription>Knowing the club can help tailor the analysis.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading || !form.formState.isValid} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Swing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Swing Feedback
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
          <p className="mt-4 text-muted-foreground">AI is analyzing your swing...</p>
        </div>
      )}

      {analysisResult && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
               <Lightbulb className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">Swing Analysis Results</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard title="Posture" content={analysisResult.postureFeedback} />
              <InfoCard title="Grip" content={analysisResult.gripFeedback} />
              <InfoCard title="Alignment" content={analysisResult.alignmentFeedback} />
              <InfoCard title="Ball Position" content={analysisResult.ballPositionFeedback} />
              <InfoCard title="Swing Plane" content={analysisResult.swingPlaneFeedback} />
              <InfoCard title="Tempo & Balance" content={analysisResult.tempoAndBalanceFeedback} />
            </div>
            
            {analysisResult.identifiedFaults && analysisResult.identifiedFaults.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><BarChartIcon className="mr-2 h-5 w-5" />Identified Faults</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {analysisResult.identifiedFaults.map((fault, index) => (
                    <li key={index}>{fault}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.suggestedDrills && analysisResult.suggestedDrills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-primary mb-3 flex items-center"><CheckCircle2 className="mr-2 h-5 w-5" />Suggested Drills</h3>
                <div className="space-y-4">
                {analysisResult.suggestedDrills.map((drill, index) => (
                  <Card key={index} className="bg-card/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{drill.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{drill.description}</p>
                    </CardContent>
                  </Card>
                ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Overall Summary</h3>
              <p className="text-muted-foreground">{analysisResult.overallSummary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface InfoCardProps { title: string; content: string; }
const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => (
  <Card className="bg-background">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg text-primary">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{content || "Not enough information or not applicable."}</p>
    </CardContent>
  </Card>
);
