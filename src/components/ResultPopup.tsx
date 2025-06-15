
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RankBadgeEffects, RankText, PositionBadge } from './RankBadgeEffects';
import { usePopup } from '@/contexts/PopupContext';
import { GameMode } from '@/services/playerService';
import { toDisplayGameMode } from '@/utils/gamemodeUtils';

// Helper to get region full name and colors
const getRegionInfo = (regionCode: string = 'NA') => {
  const regions: Record<string, { name: string, cssClass: string }> = {
    'NA': { name: 'North America', cssClass: 'region-na' },
    'EU': { name: 'Europe', cssClass: 'region-eu' },
    'ASIA': { name: 'Asia', cssClass: 'region-asia' },
    'SA': { name: 'South America', cssClass: 'region-sa' },
    'AF': { name: 'Africa', cssClass: 'region-af' },
    'OCE': { name: 'Oceania', cssClass: 'region-oce' }
  };
  
  return regions[regionCode] || regions['NA'];
};

// Get device icon component
const DeviceInfo = ({ device }: { device?: string }) => {
  return (
    <div className="flex items-center justify-center">
      <span className="text-white text-sm">{device || 'PC'}</span>
    </div>
  );
};

// Format tier for display
const formatTierDisplay = (tier: string): { code: string, label: string } => {
  let code = 'T?';
  let label = '';
  
  if (tier === 'Retired') return { code: 'RT', label: '' };
  
  // Extract tier number (T1-T5)
  if (tier.includes('T1')) code = 'T1';
  else if (tier.includes('T2')) code = 'T2';
  else if (tier.includes('T3')) code = 'T3';
  else if (tier.includes('T4')) code = 'T4';
  else if (tier.includes('T5')) code = 'T5';
  
  // Extract High/Low label
  if (tier.includes('H')) label = 'High';
  else if (tier.includes('L')) label = 'Low';
  
  return { code, label };
};

export function ResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };
  
  if (!showPopup || !popupData) return null;
  
  // Get region info for styling
  const region = popupData.player.region || 'NA';
  const regionInfo = getRegionInfo(region);
  const playerPoints = popupData.player.global_points || 0;
  const position = popupData.player.overall_rank || 1;
  
  // Ordered gamemode layout
  const orderedGamemodes: GameMode[] = [
    'Crystal', 'Sword', 'Bedwars',
    'Mace', 'SMP', 'UHC',
    'NethPot', 'Axe'
  ];
  
  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div 
            className="popup-container relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Region-based gradient overlay */}
            <div className={`region-gradient ${regionInfo.cssClass}`}></div>
            
            {/* Header bar */}
            <div className="relative py-4 text-center border-b border-white/10 bg-black/30">
              <h2 className="text-xl font-bold text-white">Player Profile</h2>
              
              {/* Close button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  closePopup();
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-white/80" />
              </button>
            </div>
            
            <div className="p-6 relative z-20">
              {/* Avatar section with enhanced rank badge */}
              <div className="flex flex-col sm:flex-row items-center mb-6">
                <div className="relative mb-4 sm:mb-0 sm:mr-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white/20 shadow-lg">
                      <AvatarImage 
                        src={`https://crafatar.com/avatars/${popupData.player.ign}?size=128&overlay=true`}
                        alt={popupData.player.ign}
                      />
                      <AvatarFallback>{popupData.player.ign.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    {/* Enhanced rank badge positioned at bottom right of avatar */}
                    <div className="absolute -bottom-2 -right-2">
                      <RankBadgeEffects 
                        points={playerPoints} 
                        size="md" 
                        animated={true}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span 
                            className="px-3 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `var(--region-color)` }}
                          >
                            {region}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{regionInfo.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <h3 className="text-xl font-bold text-white">{popupData.player.ign}</h3>
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-yellow-200 font-medium">{playerPoints} points</span>
                  </div>
                  
                  <div className="mb-3">
                    <RankText points={playerPoints} className="text-white text-lg" />
                  </div>
                </div>
              </div>
              
              {/* Enhanced Rank & Device information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center justify-center">
                  <PositionBadge position={position} points={playerPoints} />
                </div>
                
                <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                  <span className="text-gray-400 text-xs block mb-1">Device</span>
                  <DeviceInfo device={popupData.player.device} />
                </div>
              </div>
              
              {/* Gamemode Grid */}
              <div className="w-full mb-3">
                <h3 className="text-white/80 text-sm font-medium">Gamemode Rankings</h3>
              </div>
              
              <div className="gamemode-grid">
                {orderedGamemodes.map((mode, index) => {
                  const assignment = popupData.tierAssignments.find(a => a.gamemode === mode);
                  const tier = assignment?.tier || 'Not Ranked';
                  const { code, label } = formatTierDisplay(tier);
                  
                  return (
                    <motion.div
                      key={mode}
                      className="gamemode-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center p-3 bg-black/40 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-help">
                              <div className="mb-2">
                                <GameModeIcon mode={mode.toLowerCase()} className="h-10 w-10" />
                              </div>
                              <div className="text-center">
                                {tier !== 'Not Ranked' ? (
                                  <div className="flex flex-col items-center">
                                    <span className="text-white font-bold">{code}</span>
                                    {label && <span className="text-xs text-white/60">{label}</span>}
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-xs">Unranked</span>
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-center">
                              <p className="font-medium">{toDisplayGameMode(mode)}</p>
                              {tier !== 'Not Ranked' ? (
                                <p className="text-sm">{assignment?.score || 0} points</p>
                              ) : (
                                <p className="text-sm">Not Ranked</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
