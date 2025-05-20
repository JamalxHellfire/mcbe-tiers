
import React, { useState } from 'react';
import { GameModeIcon } from './GameModeIcon';
import { useMobile } from '@/hooks/useMobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Link } from 'react-router-dom';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: any;
  activePage?: string; // Make activePage optional
}

export const Navbar = ({ selectedMode, onSelectMode, navigate, activePage }: NavbarProps) => {
  const isMobile = useMobile();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-3" />
            <span className="text-xl font-bold tracking-tighter">MinePvP Tier List</span>
          </a>
        </div>
        
        {/* Navigation Links (Desktop) */}
        {!isMobile && (
          <nav className="mx-4 flex items-center space-x-4 lg:space-x-6">
            <button 
              className={`flex items-center text-sm font-medium rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedMode === 'overall' 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-foreground/70'
              }`}
              onClick={() => onSelectMode('overall')}
            >
              <GameModeIcon mode="overall" className="h-5 w-5 mr-2" />
              Overall
            </button>
            
            <button
              className={`flex items-center text-sm font-medium rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedMode === 'crystal'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70'
              }`}
              onClick={() => onSelectMode('crystal')}
            >
              <GameModeIcon mode="crystal" className="h-5 w-5 mr-2" />
              Crystal
            </button>
            
            <button
              className={`flex items-center text-sm font-medium rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedMode === 'sword'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70'
              }`}
              onClick={() => onSelectMode('sword')}
            >
              <GameModeIcon mode="sword" className="h-5 w-5 mr-2" />
              Sword
            </button>
            
            <button
              className={`flex items-center text-sm font-medium rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedMode === 'axe'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70'
              }`}
              onClick={() => onSelectMode('axe')}
            >
              <GameModeIcon mode="axe" className="h-5 w-5 mr-2" />
              Axe
            </button>
            
            <button
              className={`flex items-center text-sm font-medium rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedMode === 'mace'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70'
              }`}
              onClick={() => onSelectMode('mace')}
            >
              <GameModeIcon mode="mace" className="h-5 w-5 mr-2" />
              Mace
            </button>
            
            <button
              className={`flex items-center text-sm font-medium rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedMode === 'smp'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70'
              }`}
              onClick={() => onSelectMode('smp')}
            >
              <GameModeIcon mode="smp" className="h-5 w-5 mr-2" />
              SMP
            </button>
            
            <button
              className={`flex items-center text-sm font-medium rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedMode === 'bedwars'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70'
              }`}
              onClick={() => onSelectMode('bedwars')}
            >
              <GameModeIcon mode="bedwars" className="h-5 w-5 mr-2" />
              Bedwars
            </button>
            
            <button
              className={`flex items-center text-sm font-medium rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedMode === 'nethpot'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70'
              }`}
              onClick={() => onSelectMode('nethpot')}
            >
              <GameModeIcon mode="nethpot" className="h-5 w-5 mr-2" />
              NethPot
            </button>
            
            <button
              className={`flex items-center text-sm font-medium rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                selectedMode === 'uhc'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70'
              }`}
              onClick={() => onSelectMode('uhc')}
            >
              <GameModeIcon mode="uhc" className="h-5 w-5 mr-2" />
              UHC
            </button>
          </nav>
        )}
        
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Select a category to view the tier list.
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-4 flex flex-col space-y-2">
                <Link to="/" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Overall
                </Link>
                <Link to="/crystal" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Crystal
                </Link>
                <Link to="/sword" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Sword
                </Link>
                <Link to="/axe" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Axe
                </Link>
                <Link to="/mace" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Mace
                </Link>
                <Link to="/smp" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  SMP
                </Link>
                <Link to="/bedwars" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  Bedwars
                </Link>
                <Link to="/nethpot" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  NethPot
                </Link>
                <Link to="/uhc" className="block px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                  UHC
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        )}
        
        {/* Page Links (Desktop) */}
        {!isMobile && (
          <nav className="mx-4 flex items-center space-x-4 lg:space-x-6">
            <a href="/rankings" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              Rankings
            </a>
            <a href="/gamemodes" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              Gamemodes
            </a>
            <a href="/news" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              News
            </a>
            <a href="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground">
              About
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};
