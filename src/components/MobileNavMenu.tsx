
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: (path: string) => void;
}

export function MobileNavMenu({ isOpen, onClose, selectedMode, onSelectMode, navigate }: MobileNavMenuProps) {
  const gameModes = [
    { value: 'overall', label: 'Overall' },
    { value: 'crystal', label: 'Crystal' },
    { value: 'sword', label: 'Sword' },
    { value: 'smp', label: 'SMP' },
    { value: 'uhc', label: 'UHC' },
    { value: 'axe', label: 'Axe' },
    { value: 'nethpot', label: 'NethPot' },
    { value: 'bedwars', label: 'Bedwars' },
    { value: 'mace', label: 'Mace' },
  ];

  const handleModeChange = (mode: string) => {
    onSelectMode(mode);
    if (mode === 'overall') {
      navigate('/');
    } else {
      navigate(`/${mode}`);
    }
    onClose();
  };

  const getCurrentModeLabel = () => {
    const safeMode = selectedMode || 'overall';
    const found = gameModes.find(mode => mode.value === safeMode.toLowerCase());
    return found ? found.label : 'Select Mode';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-slate-800 border-t border-slate-700"
        >
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => { navigate('/'); onClose(); }}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
            >
              Home
            </button>

            <div className="space-y-2">
              <span className="text-gray-400 text-sm font-medium">Game Modes</span>
              {gameModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => handleModeChange(mode.value)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    (selectedMode || 'overall').toLowerCase() === mode.value 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => { navigate('/admin'); onClose(); }}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
            >
              Admin Panel
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
