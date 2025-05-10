
import React from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold">MCBE Tiers</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-foreground/80">
            Home
          </Link>
          <Link to="/about" className="transition-colors hover:text-foreground/80">
            About
          </Link>
          <Link to="/news" className="transition-colors hover:text-foreground/80">
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
