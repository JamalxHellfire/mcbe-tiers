import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameModeIcon } from './GameModeIcon';
import { Monitor, Smartphone, Gamepad } from 'lucide-react';
import { getPlayerRank } from '@/utils/rankUtils';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MinecraftLeaderboardTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

const getDeviceIcon = (device: string = 'PC') => {
  const iconProps = "w-3 h-3";
  switch(device?.toLowerCase()) {
    case 'mobile':
    case 'bedrock':
      return <Smartphone className={`${iconProps} text-blue-400`} />;
    case 'console':
      return <Gamepad className={`${iconProps} text-green-400`} />;
    case 'pc':
    case 'java':
    default:
      return <Monitor className={`${iconProps} text-white/90`} />;
  }
};

const getRegionStyling = (regionCode: string = 'NA') => {
  const regions: Record<string, { 
    bgGradient: string;
    textColor: string;
  }> = {
    'NA': { 
      bgGradient: 'bg-emerald-500',
      textColor: 'text-white'
    },
    'EU': { 
      bgGradient: 'bg-purple-500',
      textColor: 'text-white'
    },
    'ASIA': { 
      bgGradient: 'bg-red-500',
      textColor: 'text-white'
    },
    'SA': { 
      bgGradient: 'bg-orange-500',
      textColor: 'text-white'
    },
    'AF': { 
      bgGradient: 'bg-fuchsia-500',
      textColor: 'text-white'
    },
    'OCE': { 
      bgGradient: 'bg-teal-500',
      textColor: 'text-white'
    }
  };
  
  return regions[regionCode] || regions['NA'];
};

const getRankBadgeStyle = (position: number) => {
  if (position === 1) {
    return {
      gradient: 'bg-yellow-500',
      text: 'text-black'
    };
  } else if (position === 2) {
    return {
      gradient: 'bg-gray-400',
      text: 'text-black'
    };
  } else if (position === 3) {
    return {
      gradient: 'bg-orange-600',
      text: 'text-white'
    };
  } else {
    return {
      gradient: 'bg-gray-600',
      text: 'text-white'
    };
  }
};

export const MinecraftLeaderboardTable: React.FC<MinecraftLeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
  const isMobile = useIsMobile();

  const getTierBadgeColor = (tier: string) => {
    const tierStyles = {
      'HT1': 'bg-yellow-500 text-black',
      'HT2': 'bg-orange-500 text-white',
      'HT3': 'bg-red-500 text-white',
      'LT1': 'bg-green-500 text-white',
      'LT2': 'bg-blue-500 text-white',
      'LT3': 'bg-purple-500 text-white'
    };
    
    for (const [key, style] of Object.entries(tierStyles)) {
      if (tier.includes(key)) return style;
    }
    return 'bg-gray-500 text-white';
  };

  const getPlayerTierForGamemode = (player: Player, gamemode: string): string => {
    if (!player.tierAssignments) return 'Not Ranked';
    
    const assignment = player.tierAssignments.find(
      t => t.gamemode.toLowerCase() === gamemode.toLowerCase()
    );
    
    return assignment?.tier || 'Not Ranked';
  };

  const handlePlayerRowClick = (player: Player) => {
    onPlayerClick(player);
  };

  const getRowGlow = (index: number) => {
    switch (index) {
      case 0:
        return "shadow-[0_0_18px_3px_rgba(255,215,0,0.35)] border-yellow-300/50 animate-[glow-pulse_3s_infinite]";
      case 1:
        return "shadow-[0_0_16px_2px_rgba(156,163,175,0.28)] border-gray-300/40 animate-[glow-pulse_3s_infinite]";
      case 2:
        return "shadow-[0_0_16px_2px_rgba(251,146,60,0.22)] border-orange-400/40 animate-[glow-pulse_3s_infinite]";
      default:
        return "shadow-xl border-white/10";
    }
  };

  // Overwrite background gradient
  const cardBg =
    "bg-gradient-to-br from-dark-surface via-dark-surface/70 to-[#20283a]/80";
  const frosted =
    "backdrop-blur-xl bg-opacity-95 ring-1 ring-white/10";

  if (isMobile) {
    return (
      <div className="w-full space-y-4">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          const regionStyle = getRegionStyling(player.region);
          const rankBadge = getRankBadgeStyle(index + 1);

          return (
            <div
              key={player.id}
              className={`
                relative w-full rounded-xl p-3 px-4 border transition
                ${cardBg} ${frosted} ${getRowGlow(index)}
                cursor-pointer hover:scale-[1.02]
                hover:shadow-[0_0_32px_5px_rgba(0,160,255,0.13)]
                duration-200 will-change-transform
                group
              `}
              onClick={() => handlePlayerRowClick(player)}
              style={{ transitionProperty: "box-shadow, transform, border-color, filter" }}
            >
              {/* Rank bubble */}
              <div className={`
                absolute left-2 top-3 z-10 w-9 h-9 flex items-center justify-center 
                rounded-xl text-base font-bold border-2
                ${rankBadge.gradient} ${rankBadge.text}
                transition-all
                ${index === 0 ? "shadow-glow-gold" : ""}
                ${index === 1 ? "shadow-glow-orange" : ""}
                ${index === 2 ? "shadow-glow-purple" : ""}
              `}>
                {index + 1}
              </div>

              <div className="flex items-center gap-3 ml-12 mb-2">
                <Avatar className="w-10 h-10 border-2 border-white/40 group-hover:ring-2 group-hover:ring-teal-400/55 transition">
                  <AvatarImage 
                    src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                    alt={player.ign}
                    onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                  />
                  <AvatarFallback className="bg-gray-700 text-white text-sm font-bold">
                    {player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    {getDeviceIcon(player.device)}
                    <span className="font-bold text-white/95 text-base truncate drop-shadow-glow">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-bold ${rankInfo.color} drop-shadow-glow`}>
                      ◆ {rankInfo.title}
                    </span>
                    <span className="text-white/60 font-medium">({playerPoints})</span>
                  </div>
                </div>

                <span className={`
                  px-2 py-1 rounded-full text-xs font-bold 
                  border-2 border-white/20 shine-effect
                  ${regionStyle.bgGradient} ${regionStyle.textColor}
                  transition
                `}>
                  {player.region || 'NA'}
                </span>
              </div>

              {/* Game mode tiers */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
                {[
                  { mode: 'mace', gamemode: 'Mace' },
                  { mode: 'sword', gamemode: 'Sword' },
                  { mode: 'crystal', gamemode: 'Crystal' },
                  { mode: 'axe', gamemode: 'Axe' },
                  { mode: 'uhc', gamemode: 'UHC' },
                  { mode: 'smp', gamemode: 'SMP' },
                  { mode: 'nethpot', gamemode: 'NethPot' },
                  { mode: 'bedwars', gamemode: 'Bedwars' }
                ].map(({ mode, gamemode }) => {
                  const tier = getPlayerTierForGamemode(player, gamemode);

                  return (
                    <div 
                      key={mode} 
                      className="flex flex-col items-center"
                    >
                      <div className="w-7 h-7 rounded bg-gray-700/70 border border-gray-500/20 flex items-center justify-center mb-1 shine-effect">
                        <GameModeIcon mode={mode} className="w-4 h-4" />
                      </div>
                      <div className={`px-1 py-0.5 rounded text-xs font-bold ${getTierBadgeColor(tier)} min-w-[23px] text-center`}>
                        {tier === 'Not Ranked' ? 'NR' : tier}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`
      w-full rounded-2xl overflow-hidden 
      border border-white/20 shadow-2xl 
      ${cardBg} ${frosted}
    `}>
      <div className="grid grid-cols-12 gap-6 px-8 py-4 text-base font-bold text-white/90 border-b border-white/10 bg-dark-surface/70">
        <div className="col-span-1"></div>
        <div className="col-span-4">PLAYER</div>
        <div className="col-span-2 text-center">REGION</div>
        <div className="col-span-5 text-center">TIERS</div>
      </div>

      <div className="divide-y divide-white/5">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          const regionStyle = getRegionStyling(player.region);
          const rankBadge = getRankBadgeStyle(index + 1);

          return (
            <div
              key={player.id}
              className={`
                grid grid-cols-12 gap-6 px-8 py-4 cursor-pointer
                transition-all duration-200 transform-none relative z-0
                hover:scale-[1.012]
                hover:shadow-[0_0_36px_4px_rgba(0,220,255,0.10)]
                group
                ${getRowGlow(index)}
                ${index < 3 ? "after:content-[''] after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:opacity-75 after:pointer-events-none" : ""}
              `}
              style={{ transitionProperty: "box-shadow, transform, border-color, filter" }}
              onClick={() => handlePlayerRowClick(player)}
            >
              {/* Rank badge left */}
              <div className="col-span-1 flex items-center">
                <div className={`
                  w-14 h-14 flex items-center justify-center rounded-2xl text-xl font-extrabold
                  border-2
                  ${rankBadge.gradient} ${rankBadge.text}
                  transition-all
                  ${index === 0 ? "shadow-glow-gold" : ""}
                  ${index === 1 ? "shadow-glow-orange" : ""}
                  ${index === 2 ? "shadow-glow-purple" : ""}
                `}>
                  {index + 1}
                </div>
              </div>

              {/* Player + IGN */}
              <div className="col-span-4 flex items-center gap-5">
                <Avatar className="w-16 h-16 border-2 border-white/40 group-hover:ring-2 group-hover:ring-indigo-400/45 transition">
                  <AvatarImage 
                    src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                    alt={player.ign}
                    onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                  />
                  <AvatarFallback className="bg-gray-700 text-white font-bold">
                    {player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    {getDeviceIcon(player.device)}
                    <span className="text-white font-bold text-lg tracking-tight drop-shadow-glow">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-md font-bold ${rankInfo.color} drop-shadow-glow`}>
                      ◆ {rankInfo.title}
                    </span>
                    <span className="text-white/60 text-md font-medium">({playerPoints} points)</span>
                  </div>
                </div>
              </div>

              {/* Region */}
              <div className="col-span-2 flex items-center justify-center">
                <span className={`
                  px-4 py-2 rounded-full text-base font-bold border-2 border-white/25 shine-effect 
                  ${regionStyle.bgGradient} ${regionStyle.textColor}
                  relative after:absolute after:inset-0 after:rounded-full after:bg-white/10 after:pointer-events-none after:opacity-60
                `}>
                  {player.region || 'NA'}
                </span>
              </div>

              {/* Game mode tier badges */}
              <div className="col-span-5 flex items-center justify-center">
                <div className="flex items-center gap-4">
                  {[
                    { mode: 'mace', gamemode: 'Mace' },
                    { mode: 'sword', gamemode: 'Sword' },
                    { mode: 'crystal', gamemode: 'Crystal' },
                    { mode: 'axe', gamemode: 'Axe' },
                    { mode: 'uhc', gamemode: 'UHC' },
                    { mode: 'smp', gamemode: 'SMP' },
                    { mode: 'nethpot', gamemode: 'NethPot' },
                    { mode: 'bedwars', gamemode: 'Bedwars' }
                  ].map(({ mode, gamemode }) => {
                    const tier = getPlayerTierForGamemode(player, gamemode);

                    return (
                      <div 
                        key={mode} 
                        className="flex flex-col items-center"
                      >
                        <div className="w-11 h-11 rounded-lg bg-gray-700/70 border border-gray-500/20 flex items-center justify-center mb-2 shine-effect">
                          <GameModeIcon mode={mode} className="w-5 h-5" />
                        </div>
                        <div className={`px-2 py-0.5 rounded text-sm font-bold ${getTierBadgeColor(tier)} min-w-[36px] text-center`}>
                          {tier === 'Not Ranked' ? 'NR' : tier}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Custom drop-shadow utility for "glow"
//
// Add to src/index.css (user must copy this if not present)
//
// .drop-shadow-glow {
//   filter: drop-shadow(0 2px 3px rgba(0,255,255,0.22)) drop-shadow(0 0px 2px #fff3);
// }
// .shine-effect {
//   position: relative;
//   overflow: hidden;
// }
// .shine-effect:after {
//   content: '';
//   position: absolute;
//   top: -80%;
//   left: -60%;
//   width: 200%;
//   height: 200%;
//   background: linear-gradient(120deg,rgba(255,255,255,0.15) 0%,transparent 85%);
//   opacity: 0.7;
//   pointer-events: none;
//   z-index: 1;
//   transition: opacity 0.3s;
// }
// .group:hover .shine-effect:after {
//   opacity: 0.95;
// }
