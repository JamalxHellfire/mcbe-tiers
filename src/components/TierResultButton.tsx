
import React from 'react';
import { Player } from '@/services/playerService';
import { motion } from 'framer-motion';

interface TierResultButtonProps {
  player: Player;
  onClick: () => void;
}

export const TierResultButton: React.FC<TierResultButtonProps> = ({ player, onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg p-2 flex items-center space-x-2 transition-colors"
    >
      <div className="w-6 h-6 rounded overflow-hidden bg-gray-600 flex-shrink-0">
        <img
          src={`https://visage.surgeplay.com/bust/32/${player.ign}`}
          alt={player.ign}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/default-avatar.png';
          }}
        />
      </div>
      <span className="text-white text-sm font-medium truncate">{player.ign}</span>
    </motion.button>
  );
};
