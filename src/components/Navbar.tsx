import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from "@/components/ui/button";

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ selectedMode, onSelectMode, navigate }) => {
  return (
    <div className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between py-2">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold text-2xl">
            MCBE Tiers
          </Link>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            Rankings
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            Admin
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
