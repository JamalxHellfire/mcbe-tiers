
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface MobileNavMenuProps {
  currentMode: string;
}

export function MobileNavMenu({ currentMode = 'overall' }: MobileNavMenuProps) {
  const navigate = useNavigate();

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
    if (mode === 'overall') {
      navigate('/');
    } else {
      navigate(`/${mode}`);
    }
  };

  const getCurrentModeLabel = () => {
    const mode = currentMode?.toLowerCase() || 'overall';
    const found = gameModes.find(gameMode => gameMode.value === mode);
    return found ? found.label : 'Select Mode';
  };

  return (
    <div className="md:hidden w-full flex justify-center my-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full max-w-xs flex items-center justify-between text-lg py-6">
            {getCurrentModeLabel()}
            <ChevronDown size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-full max-w-xs">
          {gameModes.map((mode) => (
            <DropdownMenuItem 
              key={mode.value}
              className={`${(currentMode?.toLowerCase() || 'overall') === mode.value ? "bg-accent" : ""} text-base py-3`}
              onClick={() => handleModeChange(mode.value)}
            >
              {mode.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
