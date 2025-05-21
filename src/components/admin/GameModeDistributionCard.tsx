
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GameModeIcon } from '@/components/GameModeIcon';
import { toDisplayGameMode } from '@/utils/gamemodeCasing';

type GameModeDistributionCardProps = {
  gamemodeCounts: Record<string, number>;
};

const GameModeDistributionCard: React.FC<GameModeDistributionCardProps> = ({ gamemodeCounts }) => {
  // Convert gamemode counts object to array for Recharts
  const data = Object.entries(gamemodeCounts).map(([id, value]) => ({
    id,
    name: toDisplayGameMode(id),
    value
  }));
  
  // Sort by player count (descending)
  data.sort((a, b) => b.value - a.value);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Gamemode Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value, name) => [`${value} players`, name === "value" ? "Players" : name]}
                labelFormatter={(label) => `Gamemode: ${label}`}
              />
              <Legend />
              <Bar dataKey="value" name="Players" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {data.map(item => (
            <div key={item.id} className="flex items-center gap-2 p-2 border rounded">
              <GameModeIcon mode={item.id.toLowerCase()} className="h-5 w-5" />
              <div className="text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="ml-2 text-muted-foreground">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameModeDistributionCard;
