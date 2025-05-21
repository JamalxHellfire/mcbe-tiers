
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePopup, TierAssignment } from '@/contexts/PopupContext';
import { GameMode, DeviceType } from '@/services/playerService';
import { toDisplayGameMode } from '@/utils/gamemodeUtils';

// Helper function to determine the tier color
const getTierColor = (tier: string) => {
  if (tier.includes('T1')) return 'text-yellow-400';
  if (tier.includes('T2')) return 'text-blue-500';
  if (tier.includes('T3')) return 'text-green-500';
  if (tier.includes('T4')) return 'text-purple-500';
  if (tier.includes('T5')) return 'text-gray-400';
  return 'text-gray-400';
};

const getDeviceIcon = (device?: DeviceType) => {
  switch(device) {
    case 'Mobile': return '📱';
    case 'PC': return '⌨️🖱️';
    case 'Console': return '🎮';
    default: return '📱';
  }
};

// Define interface for particle configurations
interface ParticleConfig {
  colors: string[];
  size: { min: number; max: number; };
  speed: number;
  opacity: { min: number; max: number; };
  count: number;
  pulse?: boolean; // Make pulse optional
}

export function ResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation for effects based on rank
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
    
    // Particle configurations
    const particleConfigs: Record<string, ParticleConfig> = {
      'gold-sparkle': {
        colors: ['#FFD700', '#FFA500', '#FFFF00', '#F0E68C'],
        size: { min: 1, max: 4 },
        speed: 1.5,
        opacity: { min: 0.4, max: 0.8 },
        count: 100,
      },
      'silver-sparkle': {
        colors: ['#C0C0C0', '#E8E8E8', '#A9A9A9', '#D3D3D3'],
        size: { min: 1, max: 3.5 },
        speed: 1.3,
        opacity: { min: 0.3, max: 0.7 },
        count: 90,
      },
      'bronze-sparkle': {
        colors: ['#CD7F32', '#A0522D', '#D2691E', '#8B4513'],
        size: { min: 0.8, max: 3 },
        speed: 1.2,
        opacity: { min: 0.3, max: 0.6 },
        count: 80,
      },
      'blue-pulse': {
        colors: ['#4169E1', '#1E90FF', '#87CEEB', '#00BFFF'],
        size: { min: 1, max: 5 },
        speed: 0.8,
        opacity: { min: 0.2, max: 0.5 },
        count: 60,
        pulse: true,
      },
      'soft-glow': {
        colors: ['#FFFFFF', '#F8F8FF', '#F0F8FF'],
        size: { min: 0.5, max: 2 },
        speed: 0.6,
        opacity: { min: 0.1, max: 0.3 },
        count: 40,
      }
    };
    
    const config = particleConfigs[effectType];
    const particles: {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
      opacity: number;
    }[] = [];
    
    // Create particles
    const createParticle = () => {
      if (particles.length > config.count) return;
      
      // Create particles focused around the avatar area (top of modal)
      const avatarX = canvas.width / 2;
      const avatarY = 100;
      const radius = 100;
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      
      particles.push({
        x: avatarX + Math.cos(angle) * distance,
        y: avatarY + Math.sin(angle) * distance,
        size: config.size.min + Math.random() * (config.size.max - config.size.min),
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        speedX: (Math.random() - 0.5) * config.speed,
        speedY: (Math.random() - 0.5) * config.speed,
        life: 0,
        maxLife: 50 + Math.random() * 100,
        opacity: config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min)
      });
    };
    
    // Pulsing effect for blue pulse rank
    let pulseValue = 0;
    let pulseDirection = 0.01;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create new particles
      if (Math.random() > 0.9) {
        createParticle();
      }
      
      // Update pulse effect
      if (config.pulse) {
        pulseValue += pulseDirection;
        if (pulseValue > 1) {
          pulseValue = 1;
          pulseDirection = -pulseDirection;
        } else if (pulseValue < 0) {
          pulseValue = 0;
          pulseDirection = -pulseDirection;
        }
      }
      
      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;
        
        // Determine opacity based on life and possibly pulse
        let opacity = p.opacity * (1 - (p.life / p.maxLife));
        if (config.pulse) {
          opacity *= (0.5 + pulseValue * 0.5);
        }
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
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

  // Game mode array with proper casing
  const gameModes: GameMode[] = [
    'Crystal', 'Sword', 'Bedwars', 'Mace', 'SMP', 'UHC', 'NethPot'
  ];

  return (
    <AnimatePresence mode="wait">
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative w-full max-w-md bg-gradient-to-b from-gray-900/95 to-black/95 rounded-2xl ${popupData.combatRank.borderColor} border-2 shadow-2xl overflow-hidden`}
          >
            {/* Canvas for visual effects */}
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 pointer-events-none z-10"
            />
            
            {/* Close button */}
            <button 
              onClick={closePopup}
              className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-white/80" />
            </button>
            
            <div className="relative z-10 p-6 flex flex-col items-center">
              {/* Avatar Section */}
              <div className="relative mb-4">
                <Avatar className="h-28 w-28 border-4 border-white/10 shadow-lg">
                  <AvatarImage 
                    src={`https://crafatar.com/avatars/${popupData.player.java_username || popupData.player.ign}?size=160&overlay=true`}
                    alt={popupData.player.ign}
                  />
                  <AvatarFallback>{popupData.player.ign.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                {/* Circular avatar glow effect based on rank */}
                <div className={`absolute inset-0 z-[-1] rounded-full blur-md opacity-70 ${
                  popupData.combatRank.effectType === 'gold-sparkle' ? 'bg-yellow-400/30' :
                  popupData.combatRank.effectType === 'silver-sparkle' ? 'bg-gray-300/30' :
                  popupData.combatRank.effectType === 'bronze-sparkle' ? 'bg-amber-700/30' :
                  popupData.combatRank.effectType === 'blue-pulse' ? 'bg-blue-400/30' : 'bg-gray-400/20'
                }`}></div>
              </div>
              
              {/* Player Info */}
              <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs">
                    {popupData.player.region || 'NA'}
                  </span>
                  <h2 className="text-xl font-bold">{popupData.player.ign}</h2>
                </div>
                
                <div className={`mt-2 inline-block px-3 py-1 rounded-full ${popupData.combatRank.color} bg-white/5 border border-white/10`}>
                  {popupData.combatRank.title}
                </div>
                
                <div className="mt-2 text-white/70 text-sm flex items-center justify-center">
                  <span className="mr-1">Device:</span>
                  <span>{getDeviceIcon(popupData.player.device)}</span>
                  <span className="ml-1">{popupData.player.device || 'PC'}</span>
                </div>
              </div>
              
              {/* Gamemode Tier Grid */}
              <div className="grid grid-cols-4 gap-3 w-full">
                {gameModes.map(mode => {
                  const assignment = popupData.tierAssignments.find(a => 
                    a.gamemode === mode
                  );
                  const tier = assignment?.tier || 'Not Ranked';
                  const points = assignment?.points || 0;
                  
                  return (
                    <TooltipProvider key={mode}>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-help">
                            <GameModeIcon mode={mode.toLowerCase()} className="h-8 w-8 mb-1" />
                            <span className={`text-xs font-medium ${tier !== 'Not Ranked' ? getTierColor(tier) : 'text-gray-400'}`}>
                              {tier !== 'Not Ranked' ? tier : '—'}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <p className="font-medium">{toDisplayGameMode(mode)}</p>
                            <p className="text-sm">{tier !== 'Not Ranked' ? tier : 'Not Ranked'}</p>
                            {tier !== 'Not Ranked' && (
                              <p className="text-xs text-muted-foreground">{points} points</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
              
              {/* Combat Points */}
              <div className="mt-4 text-center">
                <p className="text-sm text-white/60">
                  Total Points: <span className={popupData.combatRank.color}>
                    {popupData.combatRank.points}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
