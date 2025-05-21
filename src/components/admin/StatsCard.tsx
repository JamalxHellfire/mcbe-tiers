
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type StatsCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, className }) => {
  return (
    <Card className={className}>
      <CardContent className="flex flex-row items-center justify-between p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
