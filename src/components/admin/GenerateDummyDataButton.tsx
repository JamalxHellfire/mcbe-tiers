
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Loader, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TIER_POINTS, SUPPORTED_GAMEMODES, REGIONS, DEVICES } from '@/types';

// Helper to generate Minecraft-style usernames
const generateIGN = () => {
  const prefixes = ['Iron', 'Gold', 'Diamond', 'Epic', 'Pro', 'Supreme', 'Swift', 'Hyper', 'Ultra', 'Mega', 'Super', 'Night', 'Day', 'Sky', 'Fire', 'Ice', 'Water', 'Shadow', 'Light', 'Dark', 'Void', 'Golden', 'Silver', 'Crimson', 'Azure', 'Emerald', 'Ruby', 'Quick'];
  const suffixes = ['Player', 'Gamer', 'Gaming', 'MC', 'Plays', 'PvP', 'Pro', 'Noob', 'God', 'King', 'Queen', 'Master', 'Slayer', 'Hunter', 'Knight', 'Warrior', 'Archer', 'Mage', 'Rogue', 'Ninja', 'Samurai', 'Sniper', 'Legend'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const number = Math.random() > 0.7 ? Math.floor(Math.random() * 999) : '';
  return `${prefix}${suffix}${number}`;
};

// Helper to generate Java usernames (for avatars)
const javaUsernames = [
  'Notch', 'jeb_', 'Dinnerbone', 'Grumm', 'Searge', 'KrisJelbring', 'EvilSeph', 'Bopogamel', 'marc_IRL', 'Xilefian',
  'Technoblade', 'Dream', 'GeorgeNotFound', 'Sapnap', 'TommyInnit', 'Tubbo_', 'Philza', 'Wilbur', 'JSchlatt', 'Quackity',
  'Skeppy', 'BadBoyHalo', 'CaptainSparklez', 'DanTDM', 'StampyLongHead', 'PopularMMOs', 'iHasCupquake', 'SkyDoesMinecraft', 
  'deadmau5', 'BajanCanadian', 'JeromeASF', 'LDShadowLady', 'Syndicate', 'Yogscast', 'AntVenom', 'CavemanFilms'
];

// Generate a random Java username
const getRandomJavaUsername = () => {
  return javaUsernames[Math.floor(Math.random() * javaUsernames.length)];
};

// Generate a random tier
const getRandomTier = () => {
  return TIER_POINTS[Math.floor(Math.random() * TIER_POINTS.length)];
};

export function GenerateDummyDataButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateDummyData = async () => {
    setIsGenerating(true);
    
    try {
      // First clear existing data
      await supabase.from("gamemode_scores").delete().neq("id", "none");
      await supabase.from("players").delete().neq("id", "none");
      
      toast.info("Cleared existing data, generating new dummy data...");
      
      // Generate 100 dummy players
      const players = [];
      const usedIgns = new Set();
      
      for (let i = 0; i < 100; i++) {
        // Generate unique IGN
        let ign = generateIGN();
        while (usedIgns.has(ign)) {
          ign = generateIGN();
        }
        usedIgns.add(ign);
        
        const java_username = getRandomJavaUsername();
        const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
        const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
        
        players.push({
          ign,
          java_username,
          avatar_url: `https://crafthead.net/avatar/${java_username}`,
          device,
          region,
          gamemode: 'overall', // Legacy field
          tier_number: 'tier', // Legacy field
        });
      }
      
      // Insert players
      const { data: createdPlayers, error: playerError } = await supabase
        .from("players")
        .insert(players)
        .select("id, ign");
      
      if (playerError) {
        throw playerError;
      }
      
      // Generate gamemode scores for players
      const scores = [];
      
      for (const player of createdPlayers) {
        // Assign 1-5 gamemodes to each player (randomly)
        const numGamemodes = Math.floor(Math.random() * 5) + 1;
        const gamemodes = [...SUPPORTED_GAMEMODES].filter(gm => gm !== 'overall');
        const selectedGamemodes = [];
        
        for (let i = 0; i < numGamemodes; i++) {
          if (gamemodes.length === 0) break;
          
          const randomIndex = Math.floor(Math.random() * gamemodes.length);
          const gamemode = gamemodes[randomIndex];
          gamemodes.splice(randomIndex, 1);
          
          if (gamemode === 'overall') continue;
          
          selectedGamemodes.push(gamemode);
          
          const tier = getRandomTier();
          
          scores.push({
            player_id: player.id,
            gamemode,
            score: tier.points,
            internal_tier: tier.internal_tier,
            display_tier: tier.display_tier,
          });
        }
      }
      
      // Insert scores
      const { error: scoresError } = await supabase
        .from("gamemode_scores")
        .insert(scores);
      
      if (scoresError) {
        throw scoresError;
      }
      
      // Update global points for all players
      for (const player of createdPlayers) {
        // Get player's scores
        const { data: playerScores } = await supabase
          .from("gamemode_scores")
          .select("score")
          .eq("player_id", player.id);
        
        // Calculate global points
        const globalPoints = playerScores?.reduce((sum, score) => sum + score.score, 0) || 0;
        
        // Update player's global points
        await supabase
          .from("players")
          .update({ global_points: globalPoints })
          .eq("id", player.id);
      }
      
      toast.success(`Generated ${players.length} dummy players and ${scores.length} scores`);
    } catch (error) {
      console.error("Failed to generate dummy data:", error);
      toast.error("Failed to generate dummy data");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button
      onClick={generateDummyData}
      disabled={isGenerating}
      className="flex items-center gap-2"
      variant="destructive"
    >
      {isGenerating ? (
        <Loader className="animate-spin h-4 w-4 mr-1" />
      ) : (
        <Database className="h-4 w-4 mr-1" />
      )}
      {isGenerating ? 'Generating...' : 'Generate 100 Dummy Players'}
    </Button>
  );
}
