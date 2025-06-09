
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { X, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { playerService, GameMode, TierLevel } from '@/services/playerService';
import { GameModeIcon } from './GameModeIcon';

interface EnhancedPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: any;
}

export function EnhancedPlayerModal({ isOpen, onClose, player }: EnhancedPlayerModalProps) {
  const [playerTiers, setPlayerTiers] = useState<Record<GameMode, { tier: TierLevel, score: number }>>({} as any);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  
  // Fetch player's avatar using Mojang API + Visage
  useEffect(() => {
    if (isOpen && player && player.ign) {
      // First try to get UUID from Mojang API
      const fetchAvatar = async () => {
        try {
          const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${player.ign}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.id) {
              setAvatarUrl(`https://visage.surgeplay.com/bust/128/${data.id}`);
              return;
            }
          }
        } catch (error) {
          console.error('Error fetching avatar:', error);
        }
        // Fallback to using IGN directly with Visage
        setAvatarUrl(`https://visage.surgeplay.com/bust/128/${player.ign}`);
      };
      
      fetchAvatar();
    }
  }, [isOpen, player]);
  
  // Fetch player's tiers across all gamemodes
  useEffect(() => {
    if (isOpen && player && player.id) {
      playerService.getPlayerTiers(player.id)
        .then(tiers => {
          setPlayerTiers(tiers);
        })
        .catch(err => {
          console.error('Error fetching player tiers:', err);
        });
    }
  }, [isOpen, player]);
  
  const allGamemodes: GameMode[] = [
    'Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'
  ];
  
  if (!player) return null;
  
  const playerPoints = Number(player?.global_points || player?.points || 0);
  
  // Combat rank determination
  const getCombatRank = () => {
    if (playerPoints >= 300) return { title: 'Combat Master', color: 'text-yellow-400' };
    if (playerPoints >= 200) return { title: 'Combat Ace', color: 'text-red-400' };
    return { title: 'Combat Rookie', color: 'text-blue-400' };
  };
  
  const combatRank = getCombatRank();
  
  // Get region display name
  const getRegionName = (region: string) => {
    const regions: Record<string, string> = {
      'NA': 'North America',
      'EU': 'Europe',
      'ASIA': 'Asia',
      'SA': 'South America',
      'OCE': 'Oceania',
      'AF': 'Africa'
    };
    return regions[region] || region;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1a1a2e] border-gray-700 max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          {/* Header with avatar */}
          <div className="flex flex-col items-center pt-8 pb-6 px-6">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden">
                <img 
                  src={avatarUrl} 
                  alt={player.ign}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://visage.surgeplay.com/bust/128/steve`;
                  }}
                />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">{player.ign}</h2>
            
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 ${combatRank.color}`}>
              <span className="text-sm font-medium">{combatRank.title}</span>
            </div>
            
            <div className="text-gray-400 text-sm mt-2">
              {getRegionName(player.region || 'NA')}
            </div>
          </div>
          
          {/* Position Section */}
          <div className="px-6 mb-6">
            <h3 className="text-gray-400 text-sm font-medium mb-3">POSITION</h3>
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg p-4 flex items-center">
              <div className="bg-yellow-600 text-black font-bold text-xl px-3 py-1 rounded mr-3">
                {player.position || '1'}
              </div>
              <div className="flex items-center text-white">
                <Trophy className="h-5 w-5 mr-2" />
                <span className="font-bold text-lg">OVERALL</span>
                <span className="ml-2 text-sm opacity-80">({playerPoints} points)</span>
              </div>
            </div>
          </div>
          
          {/* Tiers Section */}
          <div className="px-6 pb-6">
            <h3 className="text-gray-400 text-sm font-medium mb-3">TIERS</h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {allGamemodes.map((mode) => {
                  const tierData = playerTiers[mode];
                  const tier = tierData?.tier || 'Not Ranked';
                  
                  let tierDisplay = '???';
                  let tierColor = 'bg-gray-600';
                  
                  if (tier !== 'Not Ranked' && tier !== 'Retired') {
                    if (tier.startsWith('HT')) {
                      const tierNum = tier.substring(2);
                      tierDisplay = `HT${tierNum}`;
                      tierColor = 'bg-yellow-600';
                    } else if (tier.startsWith('LT')) {
                      const tierNum = tier.substring(2);
                      tierDisplay = `LT${tierNum}`;
                      tierColor = 'bg-orange-600';
                    }
                  }
                  
                  return (
                    <div 
                      key={mode}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${tierColor} text-white`}
                    >
                      <GameModeIcon mode={mode.toLowerCase()} className="h-4 w-4" />
                      <span>{tierDisplay}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
