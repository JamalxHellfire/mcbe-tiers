
import { GameMode, TierLevel, PlayerRegion, DeviceType } from '@/services/playerService';
import { supabase } from '@/integrations/supabase/client';
import { calculateTierPoints } from '@/services/playerService';

// Random name generators
const firstNames = [
  'Alex', 'Steve', 'Notch', 'Herobrine', 'Ender', 'Creeper', 'Zombie', 'Skeleton',
  'Phantom', 'Blaze', 'Ghast', 'Wither', 'Dragon', 'Slime', 'Iron', 'Gold',
  'Diamond', 'Emerald', 'Obsidian', 'Netherite', 'Brick', 'Stone', 'Wood', 'Glass',
  'Piston', 'Redstone', 'Block', 'Cube', 'Pixel', 'Voxel', 'Pick', 'Axe',
  'Sword', 'Bow', 'Arrow', 'Shield', 'Armor', 'Potion', 'Magic', 'Alchemy',
  'Wizard', 'Knight', 'Archer', 'Warrior', 'Miner', 'Crafter', 'Builder', 'Explorer'
];

const lastNames = [
  'Miner', 'Digger', 'Builder', 'Crafter', 'Explorer', 'Fighter', 'Survivor', 'Hunter',
  'Killer', 'Slayer', 'Player', 'Gamer', 'Pro', 'Expert', 'Master', 'Champion',
  'Legend', 'Warrior', 'Knight', 'Archer', 'Wizard', 'Enchanter', 'Smith', 'Brewer',
  'Farmer', 'Fisher', 'Trader', 'Merchant', 'King', 'Queen', 'Lord', 'Duke',
  'Baron', 'Count', 'Sir', 'Lady', 'Prince', 'Princess', 'Emperor', 'Empress',
  'Conqueror', 'Destroyer', 'Creator', 'Maker', 'Breaker', 'Fixer', 'Helper', 'Friend'
];

const numbers = ['69', '420', '666', '777', '123', '321', '555', '999', '000', '111', '222', '333', '444', 'XxX', '_', 'MC'];

// Random helper functions
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomTier = (): TierLevel => {
  const tiers: TierLevel[] = ['LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1'];
  // 10% chance to be retired
  if (Math.random() <= 0.1) {
    return 'Retired';
  }
  return getRandomElement(tiers);
};

const getRandomRegion = (): PlayerRegion => {
  const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'];
  return getRandomElement(regions);
};

const getRandomDevice = (): DeviceType => {
  const devices: DeviceType[] = ['Mobile', 'PC', 'Console'];
  // More likely to be on PC (50%)
  const roll = Math.random();
  if (roll < 0.5) return 'PC';
  if (roll < 0.8) return 'Mobile';
  return 'Console';
};

const generateIGN = (): string => {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const number = Math.random() > 0.5 ? getRandomElement(numbers) : '';
  // Various formats
  const formats = [
    `${firstName}${lastName}`,
    `${firstName}_${lastName}`,
    `${firstName}${number}`,
    `${firstName}_${number}`,
    `${number}${firstName}`,
    `${firstName}${Math.floor(Math.random() * 1000)}`,
    `${firstName.substring(0, 3)}${lastName}`,
    `XxX_${firstName}_XxX`,
    `${firstName}TheGamer`,
    `${firstName}${getRandomElement(['Play', 'Game', 'Live', 'PvP', 'Pro'])}`
  ];
  return getRandomElement(formats);
};

export interface TestPlayer {
  ign: string;
  java_username: string;
  region: PlayerRegion;
  device: DeviceType;
  tiers: Record<GameMode, TierLevel | null>;
}

/**
 * Generate a specified number of test players
 * @param count Number of players to generate
 * @returns Array of test player data
 */
export function generateTestPlayers(count: number): TestPlayer[] {
  const players: TestPlayer[] = [];
  const gameModes: GameMode[] = ['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'];
  
  for (let i = 0; i < count; i++) {
    // Generate player data
    const ign = generateIGN();
    const java_username = ign; // Use same name for Java username
    
    // Generate player tiers for each gamemode
    const tiers: Record<GameMode, TierLevel | null> = {} as Record<GameMode, TierLevel | null>;
    
    // Each player has 30-80% chance of having a tier in each gamemode
    gameModes.forEach(gamemode => {
      tiers[gamemode] = Math.random() < (0.3 + Math.random() * 0.5) ? getRandomTier() : null;
    });
    
    players.push({
      ign,
      java_username,
      region: getRandomRegion(),
      device: getRandomDevice(),
      tiers
    });
  }
  
  return players;
}

/**
 * Inject test players into the database
 * @param count Number of test players to generate and inject
 * @returns Promise that resolves when all players are injected
 */
export async function injectTestPlayers(count: number): Promise<boolean> {
  try {
    const testPlayers = generateTestPlayers(count);
    let successCount = 0;
    
    // Process players one by one to avoid overwhelming the database
    for (const player of testPlayers) {
      try {
        // First, check if player already exists
        const { data: existingPlayer } = await supabase
          .from('players')
          .select('id')
          .eq('ign', player.ign)
          .maybeSingle();
          
        if (existingPlayer) {
          console.log(`Player ${player.ign} already exists, skipping`);
          continue;
        }
        
        // Create the player
        const { data: newPlayer, error: playerError } = await supabase
          .from('players')
          .insert({
            ign: player.ign,
            java_username: player.java_username,
            region: player.region,
            device: player.device,
            global_points: 0,  // Will be calculated later
            banned: false,
            gamemode: '',  // Legacy field
            tier_number: ''  // Legacy field
          })
          .select('id')
          .single();
          
        if (playerError) {
          console.error(`Error creating player ${player.ign}:`, playerError);
          continue;
        }
        
        const playerId = newPlayer.id;
        
        // Add tiers for each gamemode
        const gameModes: GameMode[] = ['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'];
        let totalPoints = 0;
        
        for (const gamemode of gameModes) {
          const tier = player.tiers[gamemode];
          
          if (tier) {
            const tierPoints = calculateTierPoints(tier);
            totalPoints += tierPoints;
            
            // Insert tier data
            const { error: tierError } = await supabase
              .from('gamemode_scores')
              .insert({
                player_id: playerId,
                gamemode,
                score: tierPoints,
                internal_tier: tier,
                display_tier: tier
              });
              
            if (tierError) {
              console.error(`Error adding ${gamemode} tier for ${player.ign}:`, tierError);
            }
          }
        }
        
        // Update player's global points
        const { error: pointsError } = await supabase
          .from('players')
          .update({ global_points: totalPoints })
          .eq('id', playerId);
          
        if (pointsError) {
          console.error(`Error updating points for ${player.ign}:`, pointsError);
        } else {
          successCount++;
          console.log(`Successfully added player ${player.ign} with ${totalPoints} points`);
        }
      } catch (err) {
        console.error(`Error processing player ${player.ign}:`, err);
      }
    }
    
    console.log(`Successfully injected ${successCount} out of ${count} test players`);
    return successCount > 0;
  } catch (error) {
    console.error('Error injecting test players:', error);
    return false;
  }
}

/**
 * Check how many players are currently in the database
 * @returns Promise that resolves to the count of players
 */
export async function getPlayerCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('Error getting player count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error getting player count:', error);
    return 0;
  }
}
