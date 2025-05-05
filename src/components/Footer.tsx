
import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-8 border-t border-white/10 glass mt-auto animate-fade-in">
      <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              MCBE TIERS
            </Link>
            <p className="text-white/60 text-sm mt-1">
              © 2025 MCBE TIERS. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white/60 hover:text-white/80 transition-colors text-sm">
              Home
            </Link>
            <Link to="/about" className="text-white/60 hover:text-white/80 transition-colors text-sm">
              About
            </Link>
            <Link to="/news" className="text-white/60 hover:text-white/80 transition-colors text-sm">
              News
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/60 hover:text-red-500 transition-colors duration-200"
            >
              <Youtube size={20} />
            </a>
            <a 
              href="https://discord.gg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/60 hover:text-indigo-400 transition-colors duration-200"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
        
        {/* Early version notice */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm py-2">
            This is an early version. Player data, backend, and stats will be added soon.
          </p>
        </div>
      </div>
    </footer>
  );
}
