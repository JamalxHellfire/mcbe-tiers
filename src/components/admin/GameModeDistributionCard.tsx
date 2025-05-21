
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GameModeDistributionCardProps {
  gamemodeCounts: Record<string, number>;
}

const GameModeDistributionCard: React.FC<GameModeDistributionCardProps> = ({ gamemodeCounts }) => {
  const data = Object.entries(gamemodeCounts).map(([name, value]) => ({
    name,
    players: value
  }));

  // Custom tick component to render rotated text
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#888"
          fontSize={12}
          transform="rotate(-45)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gamemode Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="name" 
                stroke="#888" 
                fontSize={12}
                height={60}
                tick={CustomXAxisTick}
              />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#333', borderColor: '#444' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="players" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No gamemode data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameModeDistributionCard;
