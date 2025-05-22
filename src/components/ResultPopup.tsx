
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  
  // Setup canvas for rank-specific effects
  useEffect(() => {
    if (!showPopup || !popupData || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Effect configurations based on rank
    const effectType = popupData.combatRank.effectType;
    
    // Particle configurations for different ranks
    const particleConfigs = {
      'general': {
        colors: ['#ff4d4d', '#ff7f50', '#ffcc00', '#ff9966'],
        size: { min: 2, max: 5 },
        speed: 1.5,
        count: 80,
        opacity: { min: 0.4, max: 0.8 }
      },
      'marshal': {
        colors: ['#ffd700', '#ffcc00', '#ffec99', '#fff9c4'],
        size: { min: 1.5, max: 4 },
        speed: 1.2,
        count: 60,
        opacity: { min: 0.3, max: 0.7 }
      },
      'ace': {
        colors: ['#C0C0C0', '#E8E8E8', '#A9A9A9', '#D3D3D3'],
        size: { min: 1, max: 3 },
        speed: 1,
        count: 50,
        opacity: { min: 0.2, max: 0.6 }
      },
      'cadet': {
        colors: ['#4169E1', '#1E90FF', '#87CEEB', '#00BFFF'],
        size: { min: 0.8, max: 2.5 },
        speed: 0.8,
        count: 40,
        opacity: { min: 0.2, max: 0.5 }
      },
      'rookie': {
        colors: ['#FFFFFF', '#F8F8FF', '#F0F8FF'],
        size: { min: 0.5, max: 1.5 },
        speed: 0.5,
        count: 30,
        opacity: { min: 0.1, max: 0.3 }
      }
    };
    
    const config = particleConfigs[effectType as keyof typeof particleConfigs] || particleConfigs.rookie;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
      life: number;
      maxLife: number;
    }> = [];
    
    // Avatar position (center of the avatar)
    const avatarX = canvas.width / 2;
    const avatarY = canvas.height / 4;
    const avatarRadius = 40;
    
    // Create particles around the avatar
    const createParticle = () => {
      if (particles.length > config.count) return;
      
      // Create particle at random position around avatar
      const angle = Math.random() * Math.PI * 2;
      const distance = avatarRadius + Math.random() * 10;
      
      const x = avatarX + Math.cos(angle) * distance;
      const y = avatarY + Math.sin(angle) * distance;
      
      const size = config.size.min + Math.random() * (config.size.max - config.size.min);
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      
      // Random direction
      const speedX = (Math.random() - 0.5) * config.speed;
      const speedY = (Math.random() - 0.5) * config.speed;
      
      const opacity = config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min);
      
      // Add to particles array
      particles.push({
        x,
        y,
        size,
        color,
        speedX,
        speedY,
        opacity,
        life: 0,
        maxLife: 50 + Math.random() * 50
      });
    };
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create new particles
      if (Math.random() > 0.8) {
        createParticle();
      }
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;
        
        // Fade out as life increases
        const opacity = p.opacity * (1 - (p.life / p.maxLife));
        
        // Draw particle
        ctx.globalAlpha = opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Remove dead particles
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [showPopup, popupData]);
  
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
  
  // Rank CSS class
  const rankColorClass = `rank-color-${popupData.combatRank.effectType}`;
  
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
            className={`popup-container ${rankColorClass}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Canvas for particle effects */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none z-10"
            />
            
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
              {/* Avatar section */}
              <div className="flex flex-col sm:flex-row items-center mb-6">
                <div className="relative mb-4 sm:mb-0 sm:mr-6">
                  <div className={`avatar-effect-wrapper`}>
                    <Avatar className="h-24 w-24 border-4 border-white/20 shadow-lg">
                      <AvatarImage 
                        src={`https://crafatar.com/avatars/${popupData.player.ign}?size=128&overlay=true`}
                        alt={popupData.player.ign}
                      />
                      <AvatarFallback>{popupData.player.ign.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    {/* Rank-based effect */}
                    <div className={`avatar-effect effect-${popupData.combatRank.effectType}`}></div>
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
                    <span className="text-yellow-200 font-medium">{popupData.combatRank.points} points</span>
                  </div>
                  
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${popupData.combatRank.color} bg-black/40 border ${popupData.combatRank.borderColor}`}>
                    <span>{popupData.combatRank.title}</span>
                  </div>
                </div>
              </div>
              
              {/* Rank & Device information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                  <span className="text-gray-400 text-xs block mb-1">Rank</span>
                  <span className="text-white text-lg font-bold">#{popupData.combatRank.rankNumber}</span>
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
                                <p className="text-sm">{assignment?.points || 0} points</p>
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
