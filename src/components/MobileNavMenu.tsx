
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

export function MobileNavMenu({ currentMode }: MobileNavMenuProps) {
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
    const found = gameModes.find(mode => mode.value === currentMode.toLowerCase());
    return found ? found.label : 'Select Mode';
  };

  return (
    <div className="md:hidden w-full flex justify-center my-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full max-w-xs flex items-center justify-between">
            {getCurrentModeLabel()}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-full max-w-xs">
          {gameModes.map((mode) => (
            <DropdownMenuItem 
              key={mode.value}
              className={currentMode.toLowerCase() === mode.value ? "bg-accent" : ""}
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
