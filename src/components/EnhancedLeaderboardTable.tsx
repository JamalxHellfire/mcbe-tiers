
import React, { useState, useEffect } from 'react';
import { Player } from '@/services/playerService';
import { Trophy } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { motion } from 'framer-motion';

interface EnhancedLeaderboardTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

export const EnhancedLeaderboardTable: React.FC<EnhancedLeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
  const [playerAvatars, setPlayerAvatars] = useState<Record<string, string>>({});
  
  // Fetch avatars for all players
  useEffect(() => {
    const fetchAvatars = async () => {
      const avatarPromises = players.map(async (player) => {
        try {
          const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${player.ign}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.id) {
              return { id: player.id, url: `https://visage.surgeplay.com/bust/64/${data.id}` };
            }
          }
        } catch (error) {
          console.error('Error fetching avatar for', player.ign, error);
        }
        return { id: player.id, url: `https://visage.surgeplay.com/bust/64/${player.ign}` };
      });
      
      const avatarResults = await Promise.all(avatarPromises);
      const avatarMap: Record<string, string> = {};
      avatarResults.forEach(result => {
        avatarMap[result.id] = result.url;
      });
      setPlayerAvatars(avatarMap);
    };
    
    if (players.length > 0) {
      fetchAvatars();
    }
  }, [players]);
  
  const getRankStyle = (position: number) => {
    if (position === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
    if (position === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
    if (position === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-black';
    return 'bg-gray-700 text-white';
  };
  
  const getRegionStyle = (region: string) => {
    switch(region) {
      case 'NA': return 'bg-red-600 text-white';
      case 'EU': return 'bg-green-600 text-white';
      case 'ASIA': return 'bg-blue-600 text-white';
      case 'OCE': return 'bg-purple-600 text-white';
      case 'SA': return 'bg-yellow-600 text-black';
      case 'AF': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };
  
  const getCombatRank = (points: number) => {
    if (points >= 300) return { title: 'Combat Master', color: 'text-yellow-400' };
    if (points >= 200) return { title: 'Combat Ace', color: 'text-red-400' };
    return { title: 'Combat Rookie', color: 'text-blue-400' };
  };
  
  // Mock tier data for display (in real app, this would come from the player data)
  const getMockTiers = () => {
    const tiers = ['Crystal', 'Sword', 'UHC', 'Pot', 'NethOP', 'SMP', 'Sword', 'Axe', 'Mace'];
    return tiers.map((tier, index) => {
      const level = Math.floor(Math.random() * 3) + 1; // HT1, HT2, HT3, LT1, LT2, LT3
      const isHigh = Math.random() > 0.5;
      const tierCode = `${isHigh ? 'HT' : 'LT'}${level}`;
      return { gamemode: tier, tier: tierCode };
    });
  };
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800/70 border-b border-gray-700 px-6 py-4">
        <div className="grid grid-cols-12 gap-4 items-center text-gray-400 font-medium text-sm">
          <div className="col-span-1">#</div>
          <div className="col-span-4">PLAYER</div>
          <div className="col-span-2 text-center">REGION</div>
          <div className="col-span-5 text-center">TIERS</div>
        </div>
      </div>
      
      {/* Player Rows */}
      <div className="divide-y divide-gray-700/50">
        {players.map((player, index) => {
          const position = index + 1;
          const points = Number(player.global_points || 0);
          const combatRank = getCombatRank(points);
          const mockTiers = getMockTiers();
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-800/30 cursor-pointer transition-colors"
              onClick={() => onPlayerClick({ ...player, position })}
            >
              {/* Rank */}
              <div className="col-span-1">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded font-bold text-sm ${getRankStyle(position)}`}>
                  {position}
                </div>
              </div>
              
              {/* Player Info */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded overflow-hidden border-2 border-gray-600">
                  <img 
                    src={playerAvatars[player.id] || `https://visage.surgeplay.com/bust/64/${player.ign}`}
                    alt={player.ign}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://visage.surgeplay.com/bust/64/steve`;
                    }}
                  />
                </div>
                <div>
                  <div className="text-white font-medium">{player.ign}</div>
                  <div className={`text-xs ${combatRank.color} flex items-center gap-1`}>
                    <span>{combatRank.title}</span>
                    <span className="text-gray-400">({points} points)</span>
                  </div>
                </div>
              </div>
              
              {/* Region */}
              <div className="col-span-2 flex justify-center">
                <span className={`px-2 py-1 rounded text-xs font-bold ${getRegionStyle(player.region || 'NA')}`}>
                  {player.region || 'NA'}
                </span>
              </div>
              
              {/* Tiers */}
              <div className="col-span-5">
                <div className="flex flex-wrap gap-1 justify-center">
                  {mockTiers.slice(0, 8).map((tier, tierIndex) => (
                    <div 
                      key={tierIndex}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        tier.tier.startsWith('HT') ? 'bg-yellow-600 text-black' : 
                        tier.tier.startsWith('LT') ? 'bg-orange-600 text-white' : 
                        'bg-gray-600 text-white'
                      }`}
                    >
                      <GameModeIcon mode={tier.gamemode.toLowerCase()} className="h-3 w-3" />
                      <span>{tier.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
