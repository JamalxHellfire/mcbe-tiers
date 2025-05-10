
import React from 'react';
import { Link, NavigateFunction } from 'react-router-dom';

export interface NavbarProps {
  selectedMode?: string;
  onSelectMode?: (mode: string) => void;
  navigate?: NavigateFunction;
  activePage?: string;
}

export function Navbar({ selectedMode, onSelectMode, navigate, activePage }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold">MCBE Tiers</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className={`transition-colors hover:text-foreground/80 ${activePage === 'home' ? 'text-foreground' : 'text-foreground/60'}`}>
            Home
          </Link>
          <Link to="/about" className={`transition-colors hover:text-foreground/80 ${activePage === 'about' ? 'text-foreground' : 'text-foreground/60'}`}>
            About
          </Link>
          <Link to="/news" className={`transition-colors hover:text-foreground/80 ${activePage === 'news' ? 'text-foreground' : 'text-foreground/60'}`}>
            News
          </Link>
          <Link to="/admin-panel" className="transition-colors hover:text-foreground/80">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
