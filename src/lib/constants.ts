
import { GameMode, TierLevel } from '@/services/playerService';
import { Gem, Sword, Server, Heart, Axe, FlaskConical, BedDouble } from 'lucide-react';

export const GAMEMODES: { name: GameMode; icon: React.ElementType }[] = [
  { name: 'Crystal', icon: Gem },
  { name: 'Sword', icon: Sword },
  { name: 'SMP', icon: Server },
  { name: 'UHC', icon: Heart },
  { name: 'Axe', icon: Axe },
  { name: 'NethPot', icon: FlaskConical },
  { name: 'Bedwars', icon: BedDouble },
  { name: 'Mace', icon: Axe },
];

export const TIER_LEVELS: TierLevel[] = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5', 'Retired', 'Not Ranked'];
