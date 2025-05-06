
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchPlayers } from '@/api/supabase';
import { Player } from '@/types';
import { Search, X, Monitor, Smartphone, Gamepad } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from '@/hooks/use-debounce';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onPlayerSelect: (player: Player) => void;
}

export function SearchBar({ onPlayerSelect }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const isMobile = useIsMobile();
  
  // Search for players when query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const players = await searchPlayers(debouncedQuery);
        setResults(players);
      } catch (error) {
        console.error('Failed to search players:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [debouncedQuery]);
  
  const handleSelectPlayer = (player: Player) => {
    onPlayerSelect(player);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };
  
  const getDeviceIcon = (device: string | undefined) => {
    switch(device) {
      case 'PC': return <Monitor size={16} className="mr-1" />;
      case 'Mobile': return <Smartphone size={16} className="mr-1" />;
      case 'Controller': return <Gamepad size={16} className="mr-1" />;
      default: return <Monitor size={16} className="mr-1" />;
    }
  };
  
  return (
    <div className="relative w-full max-w-xs">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search players..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => setIsOpen(true)}
              className="pr-8"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => {
                if (query) {
                  setQuery('');
                } else {
                  setIsOpen(!isOpen);
                  if (!isOpen) {
                    inputRef.current?.focus();
                  }
                }
              }}
            >
              {query ? <X size={16} /> : <Search size={16} />}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className={cn(
            "w-full p-0 max-h-[300px] overflow-y-auto shadow-lg border-white/10 bg-dark-surface/90",
            isMobile ? "w-screen" : "min-w-[300px]"
          )}
          align="start"
        >
          {isLoading ? (
            <div className="p-4 text-center text-white/60">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-white/60">
              {debouncedQuery.length > 1 ? 'No players found' : 'Type at least 2 characters to search'}
            </div>
          ) : (
            <div className="py-1">
              {results.map((player) => (
                <button
                  key={player.id}
                  className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center"
                  onClick={() => handleSelectPlayer(player)}
                >
                  <Avatar className="h-8 w-8 mr-2 border border-white/10">
                    <AvatarImage src={player.avatar_url || `https://crafthead.net/avatar/${player.ign}`} alt={player.ign} />
                    <AvatarFallback>{player.ign.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium">{player.ign}</div>
                    <div className="flex items-center text-xs text-white/60">
                      {player.device && getDeviceIcon(player.device)}
                      <span className="mr-2">{player.device || 'Unknown'}</span>
                      {player.region && <span className="text-xs px-1 rounded bg-white/10">{player.region}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
