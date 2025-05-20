
import { GameMode } from '@/services/playerService';

/**
 * Convert display names (capitalized) to GameMode type values (lowercase)
 */
export function displayToGameMode(display: string): GameMode {
  const lowerCase = display.toLowerCase() as GameMode;
  return lowerCase;
}

/**
 * Convert GameMode type values (lowercase) to display names (capitalized)
 */
export function gameModeToDisplay(mode: GameMode): string {
  switch (mode) {
    case 'crystal': return 'Crystal';
    case 'sword': return 'Sword'; 
    case 'axe': return 'Axe';
    case 'mace': return 'Mace';
    case 'smp': return 'SMP';
    case 'bedwars': return 'Bedwars';
    case 'nethpot': return 'NethPot';
    case 'uhc': return 'UHC';
    case 'overall': return 'Overall';
    default: return 'Unknown';
  }
}

/**
 * Get all gamemodes for use in mappings (lowercase)
 */
export function getAllGameModes(): GameMode[] {
  return ['crystal', 'sword', 'axe', 'mace', 'smp', 'bedwars', 'nethpot', 'uhc', 'overall'];
}

/**
 * Get display names for all gamemodes (capitalized)
 */
export function getAllGameModeDisplays(): string[] {
  return getAllGameModes().map(mode => gameModeToDisplay(mode));
}

/**
 * Create a mapping between display names and GameMode values
 */
export function createGameModeMapping(): Record<string, GameMode> {
  const mapping: Record<string, GameMode> = {};
  getAllGameModes().forEach(mode => {
    mapping[gameModeToDisplay(mode)] = mode;
  });
  return mapping;
}
