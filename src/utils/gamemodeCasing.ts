
import { GameMode } from '@/services/playerService';

/**
 * Utility functions to manage GameMode casing differences between UI display and database
 */

// Map from display case to database case
export const displayToDatabaseGameMode: Record<string, GameMode> = {
  'Crystal': 'crystal' as GameMode,
  'Sword': 'sword' as GameMode,
  'Axe': 'axe' as GameMode,
  'Mace': 'mace' as GameMode,
  'SMP': 'smp' as GameMode,
  'UHC': 'uhc' as GameMode,
  'NethPot': 'nethpot' as GameMode,
  'Bedwars': 'bedwars' as GameMode,
};

// Map from database case to display case
export const databaseToDisplayGameMode = {
  'crystal': 'Crystal',
  'sword': 'Sword',
  'axe': 'Axe',
  'mace': 'Mace',
  'smp': 'SMP',
  'uhc': 'UHC',
  'nethpot': 'NethPot',
  'bedwars': 'Bedwars'
} as Record<GameMode, string>;

/**
 * Convert display format GameMode to database format
 */
export function toDatabaseGameMode(displayMode: string): GameMode {
  return displayToDatabaseGameMode[displayMode] || (displayMode.toLowerCase() as GameMode);
}

/**
 * Convert database format GameMode to display format
 */
export function toDisplayGameMode(dbGameMode: GameMode): string {
  return databaseToDisplayGameMode[dbGameMode] || dbGameMode;
}

/**
 * Safe cast for GameMode values when working with arrays
 */
export function asGameModeArray(modes: string[]): GameMode[] {
  return modes.map(mode => toDatabaseGameMode(mode)) as GameMode[];
}
