'use client';

import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import type { ScorecardHole } from '@/lib/types';
import { INITIAL_SCORECARD } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Save, Share2, User, Sigma } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ScorecardDisplay() {
  const [playerName, setPlayerName] = useState<string>('Player 1');
  const [holes, setHoles] = useState<ScorecardHole[]>(INITIAL_SCORECARD);
  const { toast } = useToast();

  const handleInputChange = (index: number, field: keyof ScorecardHole, value: string) => {
    const newHoles = [...holes];
    const numValue = parseInt(value, 10);
    if (field === 'score' || field === 'putts') {
      newHoles[index] = { ...newHoles[index], [field]: isNaN(numValue) ? null : numValue };
    }
    setHoles(newHoles);
  };

  const totalScore = holes.reduce((sum, hole) => sum + (hole.score || 0), 0);
  const totalPutts = holes.reduce((sum, hole) => sum + (hole.putts || 0), 0);
  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Mock save
    toast({
      title: 'Scorecard Saved!',
      description: `Scores for ${playerName} have been saved. (Mock)`,
    });
  };

  const handleShare = () => {
    // Mock share
     toast({
      title: 'Share Scorecard',
      description: `Sharing functionality is not yet implemented. (Mock)`,
    });
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <ListChecks className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Virtual Scorecard</CardTitle>
        </div>
        <CardDescription>Track your scores and putts for each hole.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <Label htmlFor="playerName" className="text-lg font-medium">Player Name</Label>
            <div className="flex items-center gap-2 mt-1">
              <User className="h-5 w-5 text-muted-foreground" />
              <Input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
                className="text-lg"
                placeholder="Enter player name"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">Hole</TableHead>
                  <TableHead className="w-[100px] text-center">Par</TableHead>
                  <TableHead className="w-[100px] text-center">Score</TableHead>
                  <TableHead className="w-[100px] text-center">Putts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holes.map((hole, index) => (
                  <TableRow key={hole.hole} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                    <TableCell className="font-medium text-center">{hole.hole}</TableCell>
                    <TableCell className="text-center">{hole.par}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={hole.score === null ? '' : hole.score}
                        onChange={(e) => handleInputChange(index, 'score', e.target.value)}
                        className="text-center h-9"
                        aria-label={`Score for hole ${hole.hole}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={hole.putts === null ? '' : hole.putts}
                        onChange={(e) => handleInputChange(index, 'putts', e.target.value)}
                        className="text-center h-9"
                        aria-label={`Putts for hole ${hole.hole}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-primary/10 font-semibold">
                  <TableHead colSpan={1} className="text-right text-primary">Totals:</TableHead>
                  <TableHead className="text-center text-primary">{totalPar}</TableHead>
                  <TableHead className="text-center text-primary">{totalScore}</TableHead>
                  <TableHead className="text-center text-primary">{totalPutts}</TableHead>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Score relative to par: {totalScore - totalPar >= 0 ? `+${totalScore - totalPar}` : totalScore - totalPar}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={handleShare} className="w-full sm:w-auto">
            <Share2 className="mr-2 h-4 w-4" /> Share Score (Mock)
          </Button>
          <Button type="submit" onClick={handleSubmit} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" /> Save Round (Mock)
          </Button>
      </CardFooter>
    </Card>
  );
}
