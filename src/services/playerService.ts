
// First let's define the correct type for GameMode
export type GameMode = 'overall' | 'crystal' | 'sword' | 'axe' | 'mace' | 'smp' | 'bedwars' | 'nethpot' | 'uhc';

// Define Player types more precisely
export interface Player {
  id: string;
  ign: string;
  avatar?: string;
  java_username?: string;
  region?: PlayerRegion;
  device?: DeviceType;
  global_points?: number;
  banned?: boolean;
  tiers?: Record<GameMode, { tier: TierLevel, points: number }>;
  [key: string]: any; // Allow for dynamic properties
}

// Add additional types needed by the application
export type TierLevel = 'LT5' | 'HT5' | 'LT4' | 'HT4' | 'LT3' | 'HT3' | 'LT2' | 'HT2' | 'LT1' | 'HT1' | 'Retired' | 'Unranked';
export type PlayerRegion = 'NA' | 'EU' | 'ASIA' | 'OCE' | 'SA' | 'AF';
export type DeviceType = 'Mobile' | 'PC' | 'Console';

/**
 * Calculate points based on tier level
 * @param tier Tier level
 * @returns Points value
 */
export function calculateTierPoints(tier: TierLevel): number {
  switch (tier) {
    case 'HT1': return 1000;
    case 'LT1': return 900;
    case 'HT2': return 800;
    case 'LT2': return 700;
    case 'HT3': return 600;
    case 'LT3': return 500;
    case 'HT4': return 400;
    case 'LT4': return 300;
    case 'HT5': return 200;
    case 'LT5': return 100;
    case 'Retired': return 50;
    case 'Unranked':
    default: return 0;
  }
}

// Function to safely convert Player to GameModeRecord
export function playerToGameModeRecord(player: Player): Record<GameMode, any> {
  const result = {} as Record<GameMode, any>;
  const gameModes: GameMode[] = ['overall', 'crystal', 'sword', 'axe', 'mace', 'smp', 'bedwars', 'nethpot', 'uhc'];
  
  // Set default values for all game modes
  gameModes.forEach(mode => {
    result[mode] = player[mode] || { tier: 'Unranked', points: 0 };
  });
  
  return result;
}

// Function to safely convert GameModeRecord to Player
export function gameModeRecordToPlayer(record: Record<GameMode, any>, basePlayer: Player): Player {
  const result = { ...basePlayer };
  const gameModes: GameMode[] = ['overall', 'crystal', 'sword', 'axe', 'mace', 'smp', 'bedwars', 'nethpot', 'uhc'];
  
  gameModes.forEach(mode => {
    if (record[mode]) {
      result[mode] = record[mode];
    }
  });
  
  return result;
}

/**
 * Get players by tier and gamemode
 * @param gamemode Gamemode to filter by
 * @returns Object containing players grouped by tier
 */
export function getPlayersByTierAndGamemode(gamemode: GameMode): Record<TierLevel, Player[]> {
  const players = playerService.getPlayers();
  const result: Record<TierLevel, Player[]> = {
    'HT1': [], 'LT1': [],
    'HT2': [], 'LT2': [],
    'HT3': [], 'LT3': [],
    'HT4': [], 'LT4': [],
    'HT5': [], 'LT5': [],
    'Retired': [], 'Unranked': []
  };
  
  players.forEach(player => {
    const gameModeData = player[gamemode];
    if (gameModeData && gameModeData.tier) {
      const tier = gameModeData.tier as TierLevel;
      if (result[tier]) {
        result[tier].push(player);
      }
    } else {
      result['Unranked'].push(player);
    }
  });
  
  return result;
}

/**
 * Get ranked players for leaderboard
 * @param gamemode Gamemode to get players for
 * @returns Array of ranked players
 */
export function getRankedPlayers(gamemode: GameMode = 'overall'): Player[] {
  const players = playerService.getPlayers();
  
  // Filter out players without a rank in this gamemode
  const rankedPlayers = players.filter(player => {
    const gameModeData = player[gamemode];
    return gameModeData && gameModeData.tier !== 'Unranked';
  });
  
  // Sort by points in descending order
  return rankedPlayers.sort((a, b) => {
    const pointsA = a[gamemode]?.points || 0;
    const pointsB = b[gamemode]?.points || 0;
    return pointsB - pointsA;
  });
}

/**
 * Get player by IGN
 * @param ign In-game name to search for
 * @returns Player or undefined if not found
 */
export function getPlayerByIGN(ign: string): Player | undefined {
  const players = playerService.getPlayers();
  return players.find(player => player.ign.toLowerCase() === ign.toLowerCase());
}

/**
 * Get player tiers across all gamemodes
 * @param playerId Player ID
 * @returns Record of gamemodes and their tier info
 */
export function getPlayerTiers(playerId: string): Record<GameMode, { tier: TierLevel, score: number }> {
  const player = playerService.getPlayerById(playerId);
  if (!player) return {} as Record<GameMode, { tier: TierLevel, score: number }>;
  
  const result: Record<GameMode, { tier: TierLevel, score: number }> = {} as Record<GameMode, { tier: TierLevel, score: number }>;
  const gameModes: GameMode[] = ['overall', 'crystal', 'sword', 'axe', 'mace', 'smp', 'bedwars', 'nethpot', 'uhc'];
  
  gameModes.forEach(mode => {
    const modeData = player[mode];
    result[mode] = {
      tier: (modeData?.tier as TierLevel) || 'Unranked',
      score: modeData?.points || 0
    };
  });
  
  return result;
}

/**
 * Create a new player
 * @param playerData Player data
 * @returns Created player
 */
export function createPlayer(playerData: Omit<Player, 'id'>): Player {
  return playerService.addPlayer(playerData);
}

/**
 * Assign tier to a player
 * @param params Assignment parameters
 * @returns Updated player
 */
export function assignTier(params: {
  playerId: string, 
  gamemode: GameMode, 
  tier: TierLevel
}): Player | undefined {
  const { playerId, gamemode, tier } = params;
  const player = playerService.getPlayerById(playerId);
  if (!player) return undefined;
  
  const points = calculateTierPoints(tier);
  const updatedData: Partial<Player> = {
    [gamemode]: { tier, points }
  };
  
  return playerService.updatePlayer(playerId, updatedData);
}

/**
 * Ban or unban a player
 * @param player Player to ban
 * @returns Success status
 */
export function banPlayer(player: Player): boolean {
  if (!player || !player.id) return false;
  
  const updatedData: Partial<Player> = {
    banned: true
  };
  
  const result = playerService.updatePlayer(player.id, updatedData);
  return !!result;
}

// Simple service to manage player data (replace with actual API calls)
const initialPlayers: Player[] = [
  { id: '1', ign: 'Player1', avatar: 'https://i.pravatar.cc/150?img=1', crystal: { tier: 'HT1', points: 1200 }, sword: { tier: 'LT1', points: 1100 }, axe: { tier: 'HT1', points: 1000 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '2', ign: 'Player2', avatar: 'https://i.pravatar.cc/150?img=2', crystal: { tier: 'LT1', points: 1100 }, sword: { tier: 'HT1', points: 1200 }, axe: { tier: 'LT1', points: 900 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '3', ign: 'Player3', avatar: 'https://i.pravatar.cc/150?img=3', crystal: { tier: 'HT1', points: 1300 }, sword: { tier: 'HT1', points: 1100 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '4', ign: 'Player4', avatar: 'https://i.pravatar.cc/150?img=4', crystal: { tier: 'LT1', points: 1000 }, sword: { tier: 'LT1', points: 1000 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '5', ign: 'Player5', avatar: 'https://i.pravatar.cc/150?img=5', crystal: { tier: 'HT1', points: 1400 }, sword: { tier: 'LT1', points: 900 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '6', ign: 'Player6', avatar: 'https://i.pravatar.cc/150?img=6', crystal: { tier: 'LT1', points: 800 }, sword: { tier: 'HT1', points: 1300 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '7', ign: 'Player7', avatar: 'https://i.pravatar.cc/150?img=7', crystal: { tier: 'HT1', points: 1150 }, sword: { tier: 'LT1', points: 1050 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '8', ign: 'Player8', avatar: 'https://i.pravatar.cc/150?img=8', crystal: { tier: 'LT1', points: 950 }, sword: { tier: 'HT1', points: 1250 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '9', ign: 'Player9', avatar: 'https://i.pravatar.cc/150?img=9', crystal: { tier: 'HT1', points: 1350 }, sword: { tier: 'LT1', points: 850 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '10', ign: 'Player10', avatar: 'https://i.pravatar.cc/150?img=10', crystal: { tier: 'LT1', points: 1050 }, sword: { tier: 'HT1', points: 1150 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
];

const localStorageKey = 'mcbeTierListPlayers';

export const playerService = {
  getPlayers: (): Player[] => {
    try {
      const storedPlayers = localStorage.getItem(localStorageKey);
      return storedPlayers ? JSON.parse(storedPlayers) : initialPlayers;
    } catch (error) {
      console.error("Error fetching players from localStorage, using initial data:", error);
      return initialPlayers;
    }
  },

  savePlayers: (players: Player[]): void => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(players));
    } catch (error) {
      console.error("Error saving players to localStorage:", error);
    }
  },
  
  getPlayerById: (id: string): Player | undefined => {
    const players = playerService.getPlayers();
    return players.find(player => player.id === id);
  },
  
  updatePlayer: (id: string, updatedData: Partial<Player>): Player | undefined => {
    const players = playerService.getPlayers();
    const playerIndex = players.findIndex(player => player.id === id);
    
    if (playerIndex === -1) {
      console.error(`Player with id ${id} not found`);
      return undefined;
    }
    
    // Merge existing player data with updated data
    const updatedPlayer = { ...players[playerIndex], ...updatedData };
    players[playerIndex] = updatedPlayer;
    
    playerService.savePlayers(players);
    return updatedPlayer;
  },

  // Method to add a new player
  addPlayer: (newPlayer: Omit<Player, 'id'>): Player => {
    const players = playerService.getPlayers();
    // Generate a unique ID for the new player
    const id = String(Date.now());
    const playerToAdd: Player = { id, ...newPlayer };
    players.push(playerToAdd);
    playerService.savePlayers(players);
    return playerToAdd;
  },

  // Method to delete a player
  deletePlayer: (id: string): boolean => {
    const players = playerService.getPlayers();
    const filteredPlayers = players.filter(player => player.id !== id);
    
    if (filteredPlayers.length === players.length) {
      // No players were removed
      return false;
    }
    
    playerService.savePlayers(filteredPlayers);
    return true;
  },
  
  // Expose the helper functions through the playerService object
  getPlayerByIGN,
  getRankedPlayers,
  getPlayersByTierAndGamemode,
  createPlayer,
  assignTier,
  banPlayer,
  getPlayerTiers
};

// Export helper functions as part of playerService for easy access
export const playerServiceExports = {
  getPlayersByTierAndGamemode,
  getRankedPlayers,
  getPlayerByIGN,
  createPlayer,
  assignTier,
  banPlayer,
  getPlayerTiers
};
