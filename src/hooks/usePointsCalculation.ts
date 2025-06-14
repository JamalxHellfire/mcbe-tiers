
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { updatePlayerGlobalPoints } from '@/services/playerService';

export function usePointsCalculation() {
  useEffect(() => {
    // Listen for changes in gamemode_scores table
    const channel = supabase
      .channel('gamemode-scores-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gamemode_scores'
        },
        async (payload) => {
          console.log('Gamemode score changed:', payload);
          
          // Update global points for the affected player
          if (payload.new && payload.new.player_id) {
            await updatePlayerGlobalPoints(payload.new.player_id);
          } else if (payload.old && payload.old.player_id) {
            await updatePlayerGlobalPoints(payload.old.player_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
