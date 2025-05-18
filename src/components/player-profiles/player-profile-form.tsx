
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getPlayerProfile } from '@/ai/flows/player-profile-flow';
import type { PlayerProfileInput, PlayerProfileOutput } from '@/ai/flows/player-profile-flow';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Sparkles, UserCircle, Info, LinkIcon, AlertTriangle, BarChartHorizontalBig, History, Lightbulb } from 'lucide-react';

const formSchema = z.object({
  playerName: z.string().min(3, "Player name must be at least 3 characters long."),
});

export function PlayerProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<PlayerProfileOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setProfile(null);
    try {
      const result = await getPlayerProfile(values as PlayerProfileInput);
      setProfile(result);
      toast({
        title: 'Player Profile Ready!',
        description: `AI has generated a profile for ${result.playerName}.`,
      });
    } catch (error) {
      console.error('Error getting player profile:', error);
      toast({
        title: 'Profile Generation Error',
        description: 'Could not generate player profile. Please ensure the name is correct or try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <UserCircle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Search Player Profile</CardTitle>
          </div>
          <CardDescription>
            Enter the name of a professional golfer to get their profile and information guide.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="playerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tiger Woods, Nelly Korda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Getting Profile...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Get Player Profile</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">AI is generating the player profile...</p>
        </div>
      )}

      {profile && !isLoading && (
        <Card className="shadow-lg animate-in fade-in-50 slide-in-from-bottom-10 duration-500 max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
               <UserCircle className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl">{profile.playerName}</CardTitle>
            </div>
            {profile.disclaimer && (
                <Card className="mt-2 bg-destructive/10 border-destructive text-destructive-foreground">
                    <CardHeader className="pb-2 pt-3">
                        <CardTitle className="text-md flex items-center gap-2"><AlertTriangle className="h-5 w-5"/>Important Note</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <p className="text-xs">{profile.disclaimer}</p>
                    </CardContent>
                </Card>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            
            <InfoSection icon={<Info className="text-primary h-5 w-5"/>} title="Biography">
              <p className="text-muted-foreground">{profile.biography}</p>
            </InfoSection>

            {profile.careerHighlights && profile.careerHighlights.length > 0 && (
              <InfoSection icon={<BarChartHorizontalBig className="text-primary h-5 w-5"/>} title="Career Highlights">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {profile.careerHighlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </InfoSection>
            )}

            {profile.playingStyle && (
              <InfoSection icon={<Sparkles className="text-accent h-5 w-5"/>} title="Playing Style">
                <p className="text-muted-foreground">{profile.playingStyle}</p>
              </InfoSection>
            )}
            
            {profile.funFact && (
              <InfoSection icon={<Lightbulb className="text-primary h-5 w-5"/>} title="Fun Fact">
                <p className="text-muted-foreground">{profile.funFact}</p>
              </InfoSection>
            )}

            <InfoSection icon={<LinkIcon className="text-primary h-5 w-5"/>} title="Where to Find Official Info">
              <div className="space-y-2 text-sm">
                {profile.informationSources.officialWebsite && (
                    <p><strong>Official Website:</strong> <a href={profile.informationSources.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80">{profile.informationSources.officialWebsite}</a></p>
                )}
                <p><strong>Rankings:</strong> {profile.informationSources.rankings}</p>
                <p><strong>Tour Schedules & Scores:</strong> {profile.informationSources.tourScheduleAndScores}</p>
                <p><strong>News & Updates:</strong> {profile.informationSources.newsAndUpdates}</p>
              </div>
            </InfoSection>

          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, children, icon }) => (
  <div>
    <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

