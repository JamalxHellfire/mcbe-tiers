
import { useState } from 'react';
import { 
  playerService, 
  PlayerRegion, 
  DeviceType, 
  GameMode, 
  TierLevel 
} from '@/services/playerService';
import { toast } from "sonner";
import { usePlayerSearch } from '@/hooks/usePlayerSearch';

interface FormData {
  ign: string;
  gamemode: GameMode;
  tier: TierLevel;
  javaUsername?: string;
  region?: PlayerRegion;
  device?: DeviceType;
  notes?: string;
}

interface BulkSubmission {
  igns: string;
  gamemode: GameMode;
  tier: TierLevel;
  region?: PlayerRegion;
}

export function useAdminSubmissionForm() {
  // Single submission form state
  const [formData, setFormData] = useState<FormData>({
    ign: '',
    gamemode: 'SMP',
    tier: 'LT5',
    javaUsername: '',
    notes: ''
  });
  
  // Bulk submission form state
  const [bulkFormData, setBulkFormData] = useState<BulkSubmission>({
    igns: '',
    gamemode: 'SMP',
    tier: 'LT5'
  });
  
  // Form processing states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  
  // Player search functionality
  const playerSearch = usePlayerSearch();
  
  // Form validation for single submission
  const validateSingleForm = (): boolean => {
    if (!formData.ign.trim()) {
      toast.error('IGN (In-Game Name) is required');
      return false;
    }
    
    if (formData.ign.length > 16) {
      toast.error('IGN cannot be longer than 16 characters');
      return false;
    }
    
    // Check for special characters (only allow letters, numbers, and underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(formData.ign)) {
      toast.error('IGN can only contain letters, numbers, and underscores');
      return false;
    }
    
    return true;
  };
  
  // Form validation for bulk submission
  const validateBulkForm = (): boolean => {
    if (!bulkFormData.igns.trim()) {
      toast.error('Please enter at least one IGN');
      return false;
    }
    
    // Check each IGN in the bulk list
    const igns = bulkFormData.igns
      .split('\n')
      .map(ign => ign.trim())
      .filter(ign => ign !== '');
    
    if (igns.length === 0) {
      toast.error('Please enter at least one valid IGN');
      return false;
    }
    
    for (const ign of igns) {
      if (ign.length > 16) {
        toast.error(`IGN "${ign}" is too long (max 16 characters)`);
        return false;
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(ign)) {
        toast.error(`IGN "${ign}" contains invalid characters`);
        return false;
      }
    }
    
    return true;
  };
  
  // Handle single form submission
  const handleSubmit = async () => {
    if (!validateSingleForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await playerService.submitPlayerResult(
        formData.ign,
        formData.gamemode,
        formData.tier,
        {
          javaUsername: formData.javaUsername,
          region: formData.region,
          device: formData.device,
          notes: formData.notes
        }
      );
      
      if (success) {
        toast.success(`Successfully submitted result for ${formData.ign}`);
        // Reset form
        setFormData({
          ign: '',
          gamemode: 'SMP',
          tier: 'LT5',
          javaUsername: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle bulk form submission
  const handleBulkSubmit = async () => {
    if (!validateBulkForm()) return;
    
    setBulkSubmitting(true);
    
    try {
      const igns = bulkFormData.igns
        .split('\n')
        .map(ign => ign.trim())
        .filter(ign => ign !== '');
      
      const submissionData = igns.map(ign => ({
        ign,
        gamemode: bulkFormData.gamemode,
        tier: bulkFormData.tier,
        region: bulkFormData.region
      }));
      
      const results = await playerService.bulkSubmitResults(submissionData);
      
      toast.success(`Bulk submission complete: ${results.success} succeeded, ${results.failed} failed`);
      
      if (results.success > 0) {
        // Reset form if at least one submission succeeded
        setBulkFormData({
          igns: '',
          gamemode: 'SMP',
          tier: 'LT5'
        });
      }
    } catch (error) {
      console.error('Bulk submission error:', error);
      toast.error('Failed to process bulk submission');
    } finally {
      setBulkSubmitting(false);
    }
  };
  
  // Parse bulk submission from CSV or Excel format (comma or tab separated)
  const parseImportedData = (data: string) => {
    try {
      const lines = data.split('\n');
      const parsedData: string[] = [];
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // Try to extract just the IGN from comma or tab separated data
        const parts = trimmedLine.split(/[,\t]/);
        if (parts.length > 0) {
          const ign = parts[0].trim();
          if (ign) {
            parsedData.push(ign);
          }
        }
      }
      
      setBulkFormData({
        ...bulkFormData,
        igns: parsedData.join('\n')
      });
      
      toast.success(`Imported ${parsedData.length} IGNs`);
    } catch (error) {
      console.error('Import parse error:', error);
      toast.error('Failed to parse imported data');
    }
  };
  
  // Update form data for single submission
  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };
  
  // Update form data for bulk submission
  const updateBulkFormData = (key: keyof BulkSubmission, value: any) => {
    setBulkFormData({
      ...bulkFormData,
      [key]: value
    });
  };
  
  // Fill the form with selected player data
  const fillFormWithPlayer = (player: any) => {
    if (!player) return;
    
    setFormData({
      ...formData,
      ign: player.ign,
      javaUsername: player.java_username || '',
      region: player.region as PlayerRegion || undefined,
      device: player.device as DeviceType || undefined
    });
  };
  
  return {
    // Form state
    formData,
    bulkFormData,
    isSubmitting,
    bulkSubmitting,
    
    // Form actions
    updateFormData,
    updateBulkFormData,
    handleSubmit,
    handleBulkSubmit,
    parseImportedData,
    
    // Player search integration
    playerSearch,
    fillFormWithPlayer
  };
}
