
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Smartphone, Laptop, Monitor } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePopup, TierAssignment } from '@/contexts/PopupContext';
import { GameMode, DeviceType } from '@/services/playerService';
import { toDisplayGameMode } from '@/utils/gamemodeUtils';

// Helper to get region full name and colors
const getRegionInfo = (regionCode: string = 'NA') => {
  const regions: Record<string, { name: string, color: string, accentColor: string }> = {
    'NA': { 
      name: 'North America', 
      color: 'bg-red-500', 
      accentColor: 'from-red-600/20 to-red-900/5' 
    },
    'EU': { 
      name: 'Europe', 
      color: 'bg-blue-500', 
      accentColor: 'from-blue-600/20 to-blue-900/5' 
    },
    'ASIA': { 
      name: 'Asia', 
      color: 'bg-yellow-500', 
      accentColor: 'from-yellow-600/20 to-yellow-900/5' 
    },
    'SA': { 
      name: 'South America', 
      color: 'bg-green-500', 
      accentColor: 'from-green-600/20 to-green-900/5' 
    },
    'AF': { 
      name: 'Africa', 
      color: 'bg-purple-500', 
      accentColor: 'from-purple-600/20 to-purple-900/5' 
    },
    'OCE': { 
      name: 'Oceania', 
      color: 'bg-teal-500', 
      accentColor: 'from-teal-600/20 to-teal-900/5' 
    }
  };
  
  return regions[regionCode] || regions['NA'];
};

// Get device icon component
const DeviceIcon = ({ device }: { device?: DeviceType }) => {
  switch (device) {
    case 'Mobile':
      return <Smartphone className="mr-2 h-4 w-4" />;
    case 'Console':
      return <Monitor className="mr-2 h-4 w-4" />;
    default:
      return <Laptop className="mr-2 h-4 w-4" />;
  }
};

// Get tier display label (High/Low)
const getTierLabel = (tier: string): string => {
  if (tier.includes('H')) return 'High';
  if (tier.includes('L')) return 'Low';
  return '';
};

// Format tier for display (T1, T2, etc)
const formatTierDisplay = (tier: string): string => {
  if (tier === 'Retired') return 'RT';
  if (tier.includes('T1')) return 'T1';
  if (tier.includes('T2')) return 'T2';
  if (tier.includes('T3')) return 'T3';
  if (tier.includes('T4')) return 'T4';
  if (tier.includes('T5')) return 'T5';
  return 'T?';
};

export function ResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation for avatar effects
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
    
    const effectType = popupData.combatRank.effectType;
    let animationFrameId: number;
    
    // Particle configurations for different ranks
    const particleConfigs: Record<string, any> = {
      'firestorm': {
        colors: ['#ff4d4d', '#ff7f50', '#ffcc00', '#ff9966'],
        size: { min: 1, max: 5 },
        speed: 2,
        opacity: { min: 0.4, max: 0.8 },
        count: 120,
        lifespan: { min: 20, max: 80 },
        spiral: true
      },
      'lightning': {
        colors: ['#ffd700', '#ffcc00', '#ffec99', '#fff9c4'],
        size: { min: 1, max: 3.5 },
        speed: 2.5,
        opacity: { min: 0.3, max: 0.9 },
        count: 100,
        lifespan: { min: 10, max: 50 },
        lightning: true
      },
      'silver': {
        colors: ['#C0C0C0', '#E8E8E8', '#A9A9A9', '#D3D3D3'],
        size: { min: 0.8, max: 3 },
        speed: 1.2,
        opacity: { min: 0.3, max: 0.7 },
        count: 80,
        lifespan: { min: 30, max: 90 },
        rings: true
      },
      'blue': {
        colors: ['#4169E1', '#1E90FF', '#87CEEB', '#00BFFF'],
        size: { min: 1, max: 4 },
        speed: 1,
        opacity: { min: 0.2, max: 0.6 },
        count: 70,
        lifespan: { min: 40, max: 100 },
        twinkle: true
      },
      'white': {
        colors: ['#FFFFFF', '#F8F8FF', '#F0F8FF'],
        size: { min: 0.5, max: 2 },
        speed: 0.7,
        opacity: { min: 0.1, max: 0.4 },
        count: 50,
        lifespan: { min: 50, max: 120 },
        static: true
      }
    };
    
    const config = particleConfigs[effectType] || particleConfigs['white'];
    const particles: {
      x: number;
      y: number;
      initialX: number;
      initialY: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
      opacity: number;
      angle?: number;
      radius?: number;
    }[] = [];
    
    const avatarX = canvas.width / 2;
    const avatarY = canvas.height * 0.25;
    const avatarRadius = 40;
    
    // Create particles
    const createParticle = () => {
      if (particles.length > config.count) return;
      
      // Different particle creation strategies based on effect type
      let x, y, speedX, speedY;
      
      if (config.spiral) {
        // Spiral pattern for firestorm
        const angle = Math.random() * Math.PI * 2;
        const distance = avatarRadius + Math.random() * 10;
        x = avatarX + Math.cos(angle) * distance;
        y = avatarY + Math.sin(angle) * distance;
        speedX = Math.cos(angle) * config.speed * (0.5 + Math.random());
        speedY = Math.sin(angle) * config.speed * (0.5 + Math.random());
      } else if (config.lightning) {
        // Lightning pattern
        x = avatarX + (Math.random() - 0.5) * avatarRadius * 2;
        y = avatarY + (Math.random() - 0.5) * avatarRadius * 2;
        const angle = Math.random() * Math.PI * 2;
        speedX = Math.cos(angle) * config.speed * (0.5 + Math.random() * 1.5);
        speedY = Math.sin(angle) * config.speed * (0.5 + Math.random() * 1.5);
      } else if (config.rings) {
        // Ring pattern for silver
        const angle = Math.random() * Math.PI * 2;
        const distance = avatarRadius + Math.random() * 20;
        x = avatarX + Math.cos(angle) * distance;
        y = avatarY + Math.sin(angle) * distance;
        speedX = (Math.random() - 0.5) * config.speed;
        speedY = (Math.random() - 0.5) * config.speed;
      } else if (config.twinkle) {
        // Twinkle pattern for blue
        const angle = Math.random() * Math.PI * 2;
        const distance = avatarRadius + Math.random() * 30;
        x = avatarX + Math.cos(angle) * distance;
        y = avatarY + Math.sin(angle) * distance;
        speedX = (Math.random() - 0.5) * config.speed * 0.7;
        speedY = (Math.random() - 0.5) * config.speed * 0.7;
      } else {
        // Static glow for rookie
        const angle = Math.random() * Math.PI * 2;
        const distance = avatarRadius + Math.random() * 15;
        x = avatarX + Math.cos(angle) * distance;
        y = avatarY + Math.sin(angle) * distance;
        speedX = (Math.random() - 0.5) * config.speed * 0.5;
        speedY = (Math.random() - 0.5) * config.speed * 0.5;
      }
      
      const maxLife = config.lifespan.min + Math.random() * (config.lifespan.max - config.lifespan.min);
      
      particles.push({
        x,
        y,
        initialX: x,
        initialY: y,
        size: config.size.min + Math.random() * (config.size.max - config.size.min),
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        speedX,
        speedY,
        life: 0,
        maxLife,
        opacity: config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min),
        angle: Math.random() * Math.PI * 2,
        radius: avatarRadius + Math.random() * 20
      });
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create new particles
      for (let i = 0; i < 3; i++) {
        if (Math.random() > 0.7) {
          createParticle();
        }
      }
      
      // Update time variable for animation
      const time = Date.now() * 0.001;
      
      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Different update logic based on effect type
        if (config.spiral) {
          // Spiral motion with outward movement
          p.angle = (p.angle || 0) + 0.02;
          p.radius = (p.radius || avatarRadius) + 0.2;
          p.x = avatarX + Math.cos(p.angle) * p.radius;
          p.y = avatarY + Math.sin(p.angle) * p.radius;
        } else if (config.lightning) {
          // Lightning-like erratic movement
          if (Math.random() > 0.9) {
            p.speedX = (Math.random() - 0.5) * config.speed * 2;
            p.speedY = (Math.random() - 0.5) * config.speed * 2;
          }
          p.x += p.speedX;
          p.y += p.speedY;
        } else if (config.rings) {
          // Orbit with slight drift
          p.angle = (p.angle || 0) + 0.01;
          p.x = avatarX + Math.cos(p.angle) * (p.radius || avatarRadius);
          p.y = avatarY + Math.sin(p.angle) * (p.radius || avatarRadius);
          p.x += p.speedX * 0.3;
          p.y += p.speedY * 0.3;
        } else if (config.twinkle) {
          // Twinkle with pulsing opacity
          p.x += p.speedX;
          p.y += p.speedY;
          p.opacity = p.opacity * (0.9 + 0.1 * Math.sin(time * 3 + i));
        } else {
          // Standard movement for static glow
          p.x += p.speedX;
          p.y += p.speedY;
        }
        
        p.life++;
        
        // Determine opacity based on life
        let opacity = p.opacity * (1 - (p.life / p.maxLife));
        
        // Add pulsing effect for twinkle
        if (config.twinkle) {
          opacity *= (0.7 + 0.3 * Math.sin(time * 5 + i));
        }
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Remove dead particles
        if (p.life >= p.maxLife || 
            p.x < 0 || p.x > canvas.width || 
            p.y < 0 || p.y > canvas.height) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [showPopup, popupData]);

  // If no data or not showing, don't render
  if (!showPopup || !popupData) return null;

  // Get region styling
  const region = popupData.player.region || 'NA';
  const regionInfo = getRegionInfo(region);

  // Game mode array with proper casing
  const gameModes: GameMode[] = [
    'Crystal', 'Sword', 'Bedwars', 'Mace', 'SMP', 'UHC', 'NethPot', 'Axe'
  ];

  return (
    <AnimatePresence mode="wait">
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative w-full max-w-md bg-gradient-to-b from-gray-900 to-black rounded-xl border-2 ${popupData.combatRank.borderColor} shadow-xl overflow-hidden`}
          >
            {/* Canvas for visual effects */}
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 pointer-events-none z-10"
            />
            
            {/* Region gradient overlay for accent color */}
            <div className={`absolute inset-0 bg-gradient-to-b ${regionInfo.accentColor} pointer-events-none opacity-40`}></div>
            
            {/* Header */}
            <div className="relative py-4 text-center border-b border-white/10 bg-black/30">
              <h2 className="text-xl font-bold text-white">Player Profile</h2>
              
              {/* Close button */}
              <button 
                onClick={closePopup}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-white/80" />
              </button>
            </div>
            
            <div className="relative z-20 p-6 flex flex-col items-center">
              {/* Avatar Section */}
              <div className="relative mb-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Avatar className="h-24 w-24 border-4 border-white/20 shadow-lg">
                    <AvatarImage 
                      src={`https://crafatar.com/avatars/${popupData.player.java_username || popupData.player.ign}?size=128&overlay=true`}
                      alt={popupData.player.ign}
                    />
                    <AvatarFallback>{popupData.player.ign.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>
              
              {/* Player Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-5"
              >
                <div className="flex items-center justify-center gap-2">
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <span className={`px-3 py-0.5 ${regionInfo.color} text-white rounded-full text-xs font-medium`}>
                          {region}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{regionInfo.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <h2 className="text-xl font-bold text-white">{popupData.player.ign}</h2>
                </div>
                
                <div className="mt-2 flex items-center justify-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-200 font-medium">{popupData.combatRank.points} points</span>
                </div>
                
                <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${popupData.combatRank.color} bg-black/40 border border-white/10`}>
                  <img 
                    src={`/icons/${popupData.combatRank.icon}`} 
                    alt={popupData.combatRank.title} 
                    className="h-4 w-4"
                  />
                  <span>{popupData.combatRank.title}</span>
                </div>
              </motion.div>
              
              {/* Rank & Device */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 w-full mb-6"
              >
                <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                  <span className="text-gray-400 text-xs block mb-1">Rank</span>
                  <span className="text-white text-lg font-bold">#{popupData.combatRank.rankNumber}</span>
                </div>
                
                <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                  <span className="text-gray-400 text-xs block mb-1">Device</span>
                  <span className="text-white text-sm font-medium flex items-center justify-center">
                    <DeviceIcon device={popupData.player.device} />
                    {popupData.player.device || 'PC'}
                  </span>
                </div>
              </motion.div>
              
              {/* Gamemode Rankings Title */}
              <div className="w-full mb-3">
                <h3 className="text-white/80 text-sm font-medium">Gamemode Rankings</h3>
              </div>
              
              {/* Gamemode Grid */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {gameModes.map((mode, index) => {
                  const assignment = popupData.tierAssignments.find(a => 
                    a.gamemode === mode
                  );
                  
                  const tier = assignment?.tier || 'Not Ranked';
                  const formattedTier = formatTierDisplay(tier);
                  const tierLabel = getTierLabel(tier);
                  
                  return (
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="flex items-center p-2 bg-black/40 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-help">
                              <div className="mr-3">
                                <GameModeIcon mode={mode.toLowerCase()} className="h-8 w-8" />
                              </div>
                              <div>
                                <span className="text-white/80 text-xs block">{toDisplayGameMode(mode)}</span>
                                <div className="flex items-center gap-1.5">
                                  {tier !== 'Not Ranked' ? (
                                    <>
                                      <span className="text-white font-bold">{formattedTier}</span>
                                      <span className="text-xs text-white/60">{tierLabel}</span>
                                    </>
                                  ) : (
                                    <span className="text-gray-500 text-xs">Unranked</span>
                                  )}
                                </div>
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
