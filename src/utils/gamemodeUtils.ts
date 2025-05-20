
import { GameMode } from '@/services/playerService';

/**
 * Helper function to convert a display game mode string to the correct GameMode enum casing
 */
export function toGameMode(displayMode: string): GameMode {
  // Map visible game mode names to the correct casing
  const modeMap: Record<string, GameMode> = {
    'Crystal': 'Crystal' as GameMode,
    'Sword': 'Sword' as GameMode,
    'Axe': 'Axe' as GameMode,
    'Mace': 'Mace' as GameMode,
    'SMP': 'SMP' as GameMode,
    'UHC': 'UHC' as GameMode,
    'NethPot': 'NethPot' as GameMode,
    'Bedwars': 'Bedwars' as GameMode,
    // Lowercase variations
    'crystal': 'Crystal' as GameMode,
    'sword': 'Sword' as GameMode,
    'axe': 'Axe' as GameMode,
    'mace': 'Mace' as GameMode,
    'smp': 'SMP' as GameMode,
    'uhc': 'UHC' as GameMode,
    'nethpot': 'NethPot' as GameMode,
    'bedwars': 'Bedwars' as GameMode
  };
  
  return modeMap[displayMode] || (displayMode as GameMode);
}

/**
 * Helper function to convert a GameMode enum to a display string
 */
export function toDisplayGameMode(gamemode: GameMode): string {
  // Map database game modes to visible display names
  const displayMap: Record<GameMode, string> = {
    'Crystal': 'Crystal',
    'Sword': 'Sword',
    'Axe': 'Axe',
    'Mace': 'Mace',
    'SMP': 'SMP',
    'UHC': 'UHC',
    'NethPot': 'NethPot',
    'Bedwars': 'Bedwars',
    // Also support lowercase versions for backward compatibility
    'crystal' as unknown as GameMode: 'Crystal',
    'sword' as unknown as GameMode: 'Sword',
    'axe' as unknown as GameMode: 'Axe',
    'mace' as unknown as GameMode: 'Mace',
    'smp' as unknown as GameMode: 'SMP',
    'uhc' as unknown as GameMode: 'UHC',
    'nethpot' as unknown as GameMode: 'NethPot',
    'bedwars' as unknown as GameMode: 'Bedwars'
  };
  
  return displayMap[gamemode] || String(gamemode);
}
