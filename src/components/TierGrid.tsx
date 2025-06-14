
import React, { useState, useEffect, useCallback } from 'react';
import { TierRow } from './TierRow';
import { GameModeButton } from './GameModeButton';
import { Player } from '@/services/playerService';
import { getPlayersForTier } from '@/services/tierService';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { updatePlayerTierAssignment } from '@/services/playerService';
import { useToast } from "@/hooks/use-toast"
import { GameMode } from '@/services/playerService';
import { toDisplayGameMode } from '@/utils/gamemodeUtils';
import { RankPopup } from '@/components/RankPopupSystem';
import { useRankBadgeSystem } from '@/hooks/useRankBadgeSystem';

export function TierGrid() {
  const [playersByTier, setPlayersByTier] = useState<Record<string, Player[]>>({
    'tier-1': [],
    'tier-2': [],
    'tier-3': [],
    'tier-4': [],
    'tier-5': [],
    'unassigned': [],
    'retired': []
  });
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('Crystal');
  const { toast } = useToast()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { 
    showPopup: showRankPopup, 
    hideRankPopup, 
    currentRank, 
    playerName, 
    points 
  } = useRankBadgeSystem();

  const loadPlayers = useCallback(async (gameMode: GameMode) => {
    setLoading(true);
    setError(null);
    try {
      const playersByTier = await getPlayersForTier(gameMode);
      setPlayersByTier(playersByTier);
    } catch (e: any) {
      setError(e.message || 'Failed to load players.');
      toast({
        title: "Error",
        description: "Failed to load players. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPlayers(activeGameMode);
  }, [activeGameMode, loadPlayers]);

  const handleGameModeChange = (gameMode: GameMode) => {
    setActiveGameMode(gameMode);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const playerId = draggableId; // Keep as string now
    const newTier = destination.droppableId.replace('tier-', '').toUpperCase();

    try {
      await updatePlayerTierAssignment(playerId, activeGameMode, newTier);

      setPlayersByTier(prevPlayersByTier => {
        const start = Array.from(prevPlayersByTier[source.droppableId]);
        const [removed] = start.splice(source.index, 1);
        
        const dest = Array.from(prevPlayersByTier[destination.droppableId]);
        dest.splice(destination.index, 0, removed);

        const newPlayersByTier = {
          ...prevPlayersByTier,
          [source.droppableId]: start,
          [destination.droppableId]: dest,
        };
        
        return newPlayersByTier;
      });

      toast({
        title: "Success",
        description: `Player ${playerId} moved to ${newTier} in ${toDisplayGameMode(activeGameMode)}.`,
      })
    } catch (e: any) {
      toast({
        title: "Error",
        description: `Failed to update player ${playerId}'s tier. ${e.message}`,
        variant: "destructive",
      })
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="section-heading">Tier Assignments</h2>

      {error && (
        <div className="text-red-500 mb-4">Error: {error}</div>
      )}

      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {['Crystal', 'Sword', 'Bedwars', 'Mace', 'SMP', 'UHC', 'NethPot', 'Axe'].map((mode) => (
          <GameModeButton
            key={mode}
            mode={mode}
            active={activeGameMode === mode}
            onClick={() => handleGameModeChange(mode as GameMode)}
          />
        ))}
      </div>

      {loading ? (
        <div className="text-center">Loading players...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TierRow
              tier="Tier 1"
              tierId="tier-1"
              players={playersByTier['tier-1']}
            />
            <TierRow
              tier="Tier 2"
              tierId="tier-2"
              players={playersByTier['tier-2']}
            />
            <TierRow
              tier="Tier 3"
              tierId="tier-3"
              players={playersByTier['tier-3']}
            />
            <TierRow
              tier="Tier 4"
              tierId="tier-4"
              players={playersByTier['tier-4']}
            />
            <TierRow
              tier="Tier 5"
              tierId="tier-5"
              players={playersByTier['tier-5']}
            />
            <TierRow
              tier="Unassigned"
              tierId="unassigned"
              players={playersByTier['unassigned']}
            />
            <TierRow
              tier="Retired"
              tierId="retired"
              players={playersByTier['retired']}
            />
          </div>
        </DragDropContext>
      )}
      
      {/* Add RankPopup component */}
      {currentRank && (
        <RankPopup
          rank={currentRank}
          playerName={playerName}
          points={points}
          isOpen={showRankPopup}
          onClose={hideRankPopup}
        />
      )}
    </div>
  );
}
