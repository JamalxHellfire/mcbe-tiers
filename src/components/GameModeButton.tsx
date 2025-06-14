
import React from 'react';
import { motion } from 'framer-motion';
import { GameModeIcon } from './GameModeIcon';

interface GameModeButtonProps {
  mode: string;
  active: boolean;
  onClick: () => void;
}

export function GameModeButton({ mode, active, onClick }: GameModeButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        active
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <GameModeIcon mode={mode} className="w-5 h-5" />
      <span>{mode}</span>
    </motion.button>
  );
}
