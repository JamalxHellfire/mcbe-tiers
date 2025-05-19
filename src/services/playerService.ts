
// First let's define the correct type for GameMode
export type GameMode = 'overall' | 'crystal' | 'sword' | 'axe' | 'mace' | 'smp' | 'bedwars' | 'nethpot' | 'uhc';

// Define Player types more precisely
export interface Player {
  id: string;
  ign: string;
  avatar?: string;
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
 * @param tier Tier level to filter by
 * @param gamemode Gamemode to filter by
 * @returns Array of players matching criteria
 */
export function getPlayersByTierAndGamemode(tier: TierLevel, gamemode: GameMode): Player[] {
  const players = playerService.getPlayers();
  return players.filter(player => {
    const gameModeData = player[gamemode];
    return gameModeData && gameModeData.tier === tier;
  });
}

/**
 * Get ranked players for leaderboard
 * @param gamemode Gamemode to get players for
 * @returns Array of ranked players
 */
export function getRankedPlayers(gamemode: GameMode): Player[] {
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
 * Create a new player
 * @param playerData Player data
 * @returns Created player
 */
export function createPlayer(playerData: Omit<Player, 'id'>): Player {
  return playerService.addPlayer(playerData);
}

/**
 * Assign tier to a player
 * @param playerId Player ID
 * @param gamemode Game mode
 * @param tier Tier level
 * @returns Updated player
 */
export function assignTier(playerId: string, gamemode: GameMode, tier: TierLevel): Player | undefined {
  const player = playerService.getPlayerById(playerId);
  if (!player) return undefined;
  
  const points = calculateTierPoints(tier);
  const updatedPlayer = {
    ...player,
    [gamemode]: { tier, points }
  };
  
  return playerService.updatePlayer(playerId, updatedPlayer);
}

/**
 * Ban or unban a player
 * @param playerId Player ID
 * @param banned Ban status
 * @returns Updated player
 */
export function banPlayer(playerId: string, banned: boolean): Player | undefined {
  const player = playerService.getPlayerById(playerId);
  if (!player) return undefined;
  
  return playerService.updatePlayer(playerId, { ...player, banned });
}

// Simple service to manage player data (replace with actual API calls)
const initialPlayers: Player[] = [
  { id: '1', ign: 'Player1', avatar: 'https://i.pravatar.cc/150?img=1', crystal: { tier: 'HT', points: 1200 }, sword: { tier: 'LT', points: 1100 }, axe: { tier: 'HT', points: 1000 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '2', ign: 'Player2', avatar: 'https://i.pravatar.cc/150?img=2', crystal: { tier: 'LT', points: 1100 }, sword: { tier: 'HT', points: 1200 }, axe: { tier: 'LT', points: 900 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '3', ign: 'Player3', avatar: 'https://i.pravatar.cc/150?img=3', crystal: { tier: 'HT', points: 1300 }, sword: { tier: 'HT', points: 1100 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '4', ign: 'Player4', avatar: 'https://i.pravatar.cc/150?img=4', crystal: { tier: 'LT', points: 1000 }, sword: { tier: 'LT', points: 1000 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '5', ign: 'Player5', avatar: 'https://i.pravatar.cc/150?img=5', crystal: { tier: 'HT', points: 1400 }, sword: { tier: 'LT', points: 900 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '6', ign: 'Player6', avatar: 'https://i.pravatar.cc/150?img=6', crystal: { tier: 'LT', points: 800 }, sword: { tier: 'HT', points: 1300 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '7', ign: 'Player7', avatar: 'https://i.pravatar.cc/150?img=7', crystal: { tier: 'HT', points: 1150 }, sword: { tier: 'LT', points: 1050 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '8', ign: 'Player8', avatar: 'https://i.pravatar.cc/150?img=8', crystal: { tier: 'LT', points: 950 }, sword: { tier: 'HT', points: 1250 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '9', ign: 'Player9', avatar: 'https://i.pravatar.cc/150?img=9', crystal: { tier: 'HT', points: 1350 }, sword: { tier: 'LT', points: 850 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
  { id: '10', ign: 'Player10', avatar: 'https://i.pravatar.cc/150?img=10', crystal: { tier: 'LT', points: 1050 }, sword: { tier: 'HT', points: 1150 }, axe: { tier: 'Unranked', points: 0 }, mace: { tier: 'Unranked', points: 0 }, smp: { tier: 'Unranked', points: 0 }, bedwars: { tier: 'Unranked', points: 0 }, nethpot: { tier: 'Unranked', points: 0 }, uhc: { tier: 'Unranked', points: 0 }, overall: { tier: 'Unranked', points: 0 } },
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
    // Generate a unique ID for the new player (you might want to use a better ID generation strategy)
    const id = String(Date.now());
    const playerToAdd: Player = { id, ...newPlayer };
    players.push(playerToAdd);
    playerService.savePlayers(players);
    return playerToAdd;
  },

  // Method to delete a player
  deletePlayer: (id: string): void => {
    const players = playerService.getPlayers();
    const updatedPlayers = players.filter(player => player.id !== id);
    playerService.savePlayers(updatedPlayers);
  },
};

// Export helper functions as part of playerService for easy access
export const playerServiceExports = {
  getPlayersByTierAndGamemode,
  getRankedPlayers,
  getPlayerByIGN,
  createPlayer,
  assignTier,
  banPlayer,
};
