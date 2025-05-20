
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

// CSS classes for different sparkle/glow effects
const effectClasses = {
  'gold-sparkle': 'effect-gold-sparkle',
  'silver-sparkle': 'effect-silver-sparkle',
  'bronze-sparkle': 'effect-bronze-sparkle',
  'blue-glow': 'effect-blue-glow',
  'grey-glow': 'effect-grey-glow',
};

export function ResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation for sparkle effect
  useEffect(() => {
    if (!showPopup || !popupData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const effectType = popupData.combatRank.effectType;
    
    // Skip animation for glow effects which are handled via CSS
    if (effectType === 'blue-glow' || effectType === 'grey-glow') return;
    
    // Config for sparkle colors
    const sparkleColors = {
      'gold-sparkle': ['#FFD700', '#FFA500', '#FFFF00'],
      'silver-sparkle': ['#C0C0C0', '#E8E8E8', '#A9A9A9'],
      'bronze-sparkle': ['#CD7F32', '#A0522D', '#D2691E'],
    }[effectType] || ['#FFFFFF'];
    
    // Sparkle properties
    const particles: {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
    }[] = [];

    // Resize canvas to match container
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();
    
    // Create new sparkle particles
    const createParticles = () => {
      if (particles.length > 100) return; // Limit particles
      
      // Create particles along the edges and avatar
      const edgePositions = [
        // Top edge
        { x: Math.random() * canvas.width, y: 0 },
        // Bottom edge
        { x: Math.random() * canvas.width, y: canvas.height },
        // Left edge
        { x: 0, y: Math.random() * canvas.height },
        // Right edge
        { x: canvas.width, y: Math.random() * canvas.height },
        // Around avatar (circle around center top)
        { 
          x: canvas.width/2 + Math.cos(Math.random() * Math.PI * 2) * 80, 
          y: 120 + Math.sin(Math.random() * Math.PI * 2) * 80
        }
      ];
      
      const position = edgePositions[Math.floor(Math.random() * edgePositions.length)];
      
      particles.push({
        x: position.x,
        y: position.y,
        size: 1 + Math.random() * 3,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
        life: 0,
        maxLife: 50 + Math.random() * 100
      });
    };
    
    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create new particles
      if (Math.random() > 0.9) {
        createParticles();
      }
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;
        
        // Fade out as life increases
        const opacity = 1 - (p.life / p.maxLife);
        
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
    };
  }, [showPopup, popupData]);

  // If no data or not showing, don't render
  if (!showPopup || !popupData) return null;

  return (
    <AnimatePresence mode="wait">
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div 
            className={`relative w-full max-w-md bg-gradient-to-b from-gray-800/95 to-gray-900/95 rounded-2xl border ${
              popupData.combatRank.effectType.includes('glow') 
                ? `border-${popupData.combatRank.color.split('-')[1]}-500/50` 
                : 'border-white/10'
            } shadow-2xl overflow-hidden`}
          >
            {/* Canvas for sparkle effects */}
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 pointer-events-none z-10"
            />
            
            {/* Close button */}
            <button 
              onClick={closePopup}
              className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              <X className="h-5 w-5 text-white/80" />
            </button>
            
            <div className="relative z-10 p-6 flex flex-col items-center">
              {/* Avatar */}
              <div className={`mb-4 relative ${effectClasses[popupData.combatRank.effectType] || ''}`}>
                <Avatar className="h-28 w-28 border-4 border-white/10 shadow-lg">
                  <AvatarImage 
                    src={`https://crafatar.com/avatars/${popupData.player.java_username || popupData.player.ign}?size=160&overlay=true`}
                    alt={popupData.player.ign}
                  />
                  <AvatarFallback>{popupData.player.ign.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              
              {/* Player Info */}
              <div className="text-center mb-5">
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2 py-0.5 bg-white/10 rounded text-xs">
                    {popupData.player.region || 'NA'}
                  </span>
                  <h2 className="text-xl font-bold">{popupData.player.ign}</h2>
                </div>
                
                <div 
                  className={`mt-2 inline-block px-3 py-1 rounded-full ${popupData.combatRank.color} bg-white/5 border border-white/10`}
                >
                  {popupData.combatRank.title}
                </div>
                
                <div className="mt-2 text-white/70 text-sm">
                  Device: <span>{getDeviceIcon(popupData.player.device)}</span>
                </div>
              </div>
              
              {/* Gamemode Tier Grid */}
              <div className="grid grid-cols-4 gap-4 w-full">
                {(['crystal', 'axe', 'sword', 'mace', 'smp', 'bedwars', 'uhc', 'nethpot'] as GameMode[]).map(mode => {
                  const assignment = popupData.tierAssignments.find(a => a.gamemode === mode);
                  const tier = assignment?.tier || 'Not Ranked';
                  const points = assignment?.points || 0;
                  
                  return (
                    <TooltipProvider key={mode}>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <GameModeIcon mode={mode} className="h-8 w-8 mb-1" />
                            <span className={`text-xs font-medium ${tier !== 'Not Ranked' ? getTierColor(tier) : 'text-gray-400'}`}>
                              {tier !== 'Not Ranked' ? tier : '—'}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <p className="font-medium">{toDisplayGameMode(mode)}</p>
                            <p className="text-sm">{tier !== 'Not Ranked' ? tier : 'Not Ranked'}</p>
                            {tier !== 'Not Ranked' && <p className="text-xs text-muted-foreground">{points} points</p>}
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
                  Combat Points: {popupData.combatRank.points}/250
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
