
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Save, CheckCircle } from 'lucide-react';
import { submitPlayerResult } from '@/api/supabase';

const formSchema = z.object({
  ign: z.string().min(2, { message: 'IGN must be at least 2 characters' }),
  javaUsername: z.string().min(1, { message: 'Java Username is required' }),
  device: z.string().min(1, { message: 'Device is required' }),
  region: z.string().min(1, { message: 'Region is required' }),
  gamemode: z.string().min(1, { message: 'Gamemode is required' }),
  tier: z.string().min(1, { message: 'Tier is required' }),
});

type FormValues = z.infer<typeof formSchema>;

export const ResultSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ign: '',
      javaUsername: '',
      device: '',
      region: '',
      gamemode: '',
      tier: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSuccess(false);
    
    try {
      // Make sure all fields are properly passed as required by the API
      const playerData = {
        ign: data.ign,
        javaUsername: data.javaUsername,
        device: data.device,
        region: data.region,
        gamemode: data.gamemode,
        tier: data.tier
      };
      
      await submitPlayerResult(playerData);
      toast.success(`Successfully submitted result for ${data.ign}`);
      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error('Error submitting result:', error);
      toast.error('Failed to submit result');
    } finally {
      setIsSubmitting(false);
      
      // Reset success state after a delay
      if (success) {
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };

  return (
    <motion.div
      className="bg-dark-surface/60 border border-white/10 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-white mb-6">Submit Player Result</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player IGN</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter player IGN" 
                      {...field} 
                      className="bg-dark-surface/40 border-white/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="javaUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Java Username (for avatar)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Java username" 
                      {...field} 
                      className="bg-dark-surface/40 border-white/10"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Used for Crafatar API avatar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="device"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-dark-surface/40 border-white/10">
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PC">PC</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Controller">Controller</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-dark-surface/40 border-white/10">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EU">EU</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                      <SelectItem value="ASIA">ASIA</SelectItem>
                      <SelectItem value="OCE">OCE</SelectItem>
                      <SelectItem value="AF">AF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="gamemode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gamemode</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-dark-surface/40 border-white/10">
                        <SelectValue placeholder="Select gamemode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SMP">SMP</SelectItem>
                      <SelectItem value="Bedwars">Bedwars</SelectItem>
                      <SelectItem value="Mace">Mace</SelectItem>
                      <SelectItem value="UHC">UHC</SelectItem>
                      <SelectItem value="Axe">Axe</SelectItem>
                      <SelectItem value="Pot">Pot</SelectItem>
                      <SelectItem value="Sword">Sword</SelectItem>
                      <SelectItem value="Crystal">Crystal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tier</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-dark-surface/40 border-white/10">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HT1">HT1 (50pts)</SelectItem>
                      <SelectItem value="LT1">LT1 (45pts)</SelectItem>
                      <SelectItem value="HT2">HT2 (40pts)</SelectItem>
                      <SelectItem value="LT2">LT2 (35pts)</SelectItem>
                      <SelectItem value="HT3">HT3 (30pts)</SelectItem>
                      <SelectItem value="LT3">LT3 (25pts)</SelectItem>
                      <SelectItem value="HT4">HT4 (20pts)</SelectItem>
                      <SelectItem value="LT4">LT4 (15pts)</SelectItem>
                      <SelectItem value="HT5">HT5 (10pts)</SelectItem>
                      <SelectItem value="LT5">LT5 (5pts)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Submitted Successfully
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submit Result
              </>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};
