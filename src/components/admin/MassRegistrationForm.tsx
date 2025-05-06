
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { massRegisterPlayers } from '@/api/supabase';
import { toast } from 'sonner';
import { UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MassRegistrationForm() {
  const [playerData, setPlayerData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; created: number; errors: string[] }>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerData.trim()) {
      toast.error('Please enter player data');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await massRegisterPlayers(playerData);
      
      setResult(result);
      
      if (result.success) {
        toast.success(`Successfully registered ${result.created} players`);
      } else {
        toast.error('Failed to register players');
      }
    } catch (error) {
      console.error('Failed to register players:', error);
      toast.error('Failed to register players');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5" />
          Mass Player Registration
        </CardTitle>
        <CardDescription>
          Register multiple players at once. Enter player data in the format: IGN, JavaAvatarUsername (one per line)
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            value={playerData}
            onChange={(e) => setPlayerData(e.target.value)}
            placeholder="ItzJamal, Nednoxx&#10;JamalPvP, Technoblade"
            className="min-h-[200px] font-mono"
            disabled={isSubmitting}
          />
          
          {result && result.errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 text-sm">
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {result && result.success && result.created > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Successfully registered {result.created} players.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setPlayerData('')}
            disabled={isSubmitting || !playerData}
          >
            Clear
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Players'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
