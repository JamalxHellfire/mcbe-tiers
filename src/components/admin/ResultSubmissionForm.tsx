
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitPlayerResult } from '@/api/supabase';
import { toast } from 'sonner';
import { Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TIER_POINTS, SUPPORTED_GAMEMODES, REGIONS, DEVICES } from '@/types';

export function ResultSubmissionForm() {
  const [formData, setFormData] = useState({
    ign: '',
    java_username: '',
    device: '',
    region: '',
    gamemode: '',
    internal_tier: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.ign || !formData.java_username || !formData.device || 
        !formData.region || !formData.gamemode || !formData.internal_tier) {
      toast.error('All fields are required');
      return;
    }
    
    setIsSubmitting(true);
    setSuccess(false);
    
    try {
      const result = await submitPlayerResult(formData);
      
      if (result.success) {
        toast.success('Player result submitted successfully');
        setSuccess(true);
        // Clear form
        setFormData({
          ign: '',
          java_username: '',
          device: '',
          region: '',
          gamemode: '',
          internal_tier: ''
        });
      } else {
        toast.error('Failed to submit player result');
      }
    } catch (error) {
      console.error('Failed to submit player result:', error);
      toast.error('Failed to submit player result');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const selectedTier = TIER_POINTS.find(tier => tier.internal_tier === formData.internal_tier);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Submit Player Result
        </CardTitle>
        <CardDescription>
          Assign a tier and points to a player for a specific gamemode
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ign">Player IGN</Label>
              <Input
                id="ign"
                value={formData.ign}
                onChange={(e) => handleChange('ign', e.target.value)}
                placeholder="Minecraft Username"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="java_username">Java Avatar Username</Label>
              <Input
                id="java_username"
                value={formData.java_username}
                onChange={(e) => handleChange('java_username', e.target.value)}
                placeholder="Used for avatar"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="device">Device</Label>
              <Select
                value={formData.device}
                onValueChange={(value) => handleChange('device', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="device">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  {DEVICES.map(device => (
                    <SelectItem key={device} value={device}>
                      {device}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => handleChange('region', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gamemode">Gamemode</Label>
              <Select
                value={formData.gamemode}
                onValueChange={(value) => handleChange('gamemode', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="gamemode">
                  <SelectValue placeholder="Select gamemode" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_GAMEMODES
                    .filter(gamemode => gamemode !== 'overall') // Exclude overall from selection
                    .map(gamemode => (
                    <SelectItem key={gamemode} value={gamemode}>
                      {gamemode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="internal_tier">Tier</Label>
              <Select
                value={formData.internal_tier}
                onValueChange={(value) => handleChange('internal_tier', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="internal_tier">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {TIER_POINTS.map((tier) => (
                    <SelectItem key={tier.internal_tier} value={tier.internal_tier}>
                      {tier.internal_tier} ({tier.points} points)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedTier && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-900/20 border border-blue-500/30 rounded-md p-4 mt-4"
            >
              <p className="text-sm text-white/70">
                Selected tier <span className="font-bold text-white">{selectedTier.internal_tier}</span> will 
                assign <span className="font-bold text-white">{selectedTier.points} points</span> to this player.
              </p>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Player result has been submitted successfully.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setFormData({
              ign: '',
              java_username: '',
              device: '',
              region: '',
              gamemode: '',
              internal_tier: ''
            })}
            disabled={isSubmitting}
          >
            Clear Form
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Result'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
