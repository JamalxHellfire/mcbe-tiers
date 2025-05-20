
import { GameMode } from '@/services/playerService';

/**
 * Helper function to convert a display game mode string to the correct GameMode enum casing
 */
export function toGameMode(displayMode: string): GameMode {
  // Map visible game mode names to the correct casing
  const modeMap: Record<string, GameMode> = {
    'Crystal': 'crystal' as GameMode,
    'Sword': 'sword' as GameMode,
    'Axe': 'axe' as GameMode,
    'Mace': 'mace' as GameMode,
    'SMP': 'smp' as GameMode,
    'UHC': 'uhc' as GameMode,
    'NethPot': 'nethpot' as GameMode,
    'Bedwars': 'bedwars' as GameMode
  };
  
  return modeMap[displayMode] || (displayMode.toLowerCase() as GameMode);
}

/**
 * Helper function to convert a GameMode enum to a display string
 */
export function toDisplayGameMode(gamemode: GameMode): string {
  // Map database game modes to visible display names
  const displayMap = {
    'crystal': 'Crystal',
    'sword': 'Sword',
    'axe': 'Axe',
    'mace': 'Mace',
    'smp': 'SMP',
    'uhc': 'UHC',
    'nethpot': 'NethPot',
    'bedwars': 'Bedwars'
  } as Record<GameMode, string>;
  
  return displayMap[gamemode] || gamemode;
}
