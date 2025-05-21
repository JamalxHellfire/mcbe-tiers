
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GameMode } from '@/services/playerService';
import { toDisplayGameMode } from '@/utils/gamemodeCasing';

type GameModeDistributionCardProps = {
  gamemodeCounts: Record<string, number>;
  className?: string;
};

const GameModeDistributionCard: React.FC<GameModeDistributionCardProps> = ({ gamemodeCounts, className }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9370DB', '#FF6347', '#20B2AA', '#4682B4'];
  
  // Convert gamemodeCounts object to array for PieChart
  const data = Object.entries(gamemodeCounts).map(([mode, count], index) => ({
    name: toDisplayGameMode(mode as GameMode),
    value: count,
    color: COLORS[index % COLORS.length]
  }));
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Gamemode Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                paddingAngle={5}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} players`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameModeDistributionCard;
