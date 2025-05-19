// First let's define the correct type for GameMode
export type GameMode = 'overall' | 'crystal' | 'sword' | 'axe' | 'mace' | 'smp' | 'bedwars' | 'nethpot' | 'uhc';

// Define player types more precisely
export interface Player {
  id: string;
  ign: string;
  avatar?: string;
  [key: string]: any; // Allow for dynamic properties
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
