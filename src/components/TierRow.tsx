
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Player } from '@/services/playerService';
import { TierResultButton } from './TierResultButton';

interface TierRowProps {
  tier: string;
  tierId: string;
  players: Player[];
}

export function TierRow({ tier, tierId, players }: TierRowProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      <h3 className="text-white font-bold text-lg mb-4 text-center">{tier}</h3>
      <Droppable droppableId={tierId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[200px] space-y-2 p-2 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-500/20' : 'bg-transparent'
            }`}
          >
            {players.map((player, index) => (
              <Draggable
                key={player.id}
                draggableId={player.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition-transform ${
                      snapshot.isDragging ? 'rotate-2 scale-105' : ''
                    }`}
                  >
                    <TierResultButton player={player} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
