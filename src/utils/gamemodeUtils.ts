
import { GameMode } from '@/services/playerService';

/**
 * Convert display names (capitalized) to GameMode type values (lowercase)
 */
export function displayToGameMode(display: string): GameMode {
  const lowerCase = display.toLowerCase() as GameMode;
  switch (lowerCase) {
    case 'crystal':
    case 'sword':
    case 'axe':
    case 'mace':
    case 'smp':
    case 'bedwars':
    case 'nethpot':
    case 'uhc':
    case 'overall':
      return lowerCase;
    default:
      console.warn(`Invalid gamemode: ${display}`);
      return 'overall';
  }
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
    default:
      console.warn(`Unknown gamemode: ${mode}`);
      return 'Unknown';
  }
}

/**
 * Get all gamemodes for use in mappings
 */
export function getAllGameModes(): GameMode[] {
  return ['crystal', 'sword', 'axe', 'mace', 'smp', 'bedwars', 'nethpot', 'uhc', 'overall'];
}

/**
 * Get display names for all gamemodes
 */
export function getAllGameModeDisplays(): string[] {
  return ['Crystal', 'Sword', 'Axe', 'Mace', 'SMP', 'Bedwars', 'NethPot', 'UHC', 'Overall'];
}

/**
 * Create a mapping between display names and GameMode values
 */
export function createGameModeMapping(): Record<string, GameMode> {
  return {
    'Crystal': 'crystal',
    'Sword': 'sword',
    'Axe': 'axe',
    'Mace': 'mace',
    'SMP': 'smp',
    'Bedwars': 'bedwars',
    'NethPot': 'nethpot',
    'UHC': 'uhc',
    'Overall': 'overall'
  };
}
