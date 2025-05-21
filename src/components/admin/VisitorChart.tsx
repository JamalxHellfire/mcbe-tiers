
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ChartData = {
  date?: string;
  week?: string;
  month?: string;
  visits: number;
  [key: string]: any;
};

type VisitorChartProps = {
  dailyData: ChartData[];
  weeklyData: ChartData[];
  monthlyData: ChartData[];
};

const VisitorChart: React.FC<VisitorChartProps> = ({ dailyData, weeklyData, monthlyData }) => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Select the correct data based on the timeframe
  const chartData = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData
  }[timeFrame];

  // Determine the label key based on the timeframe
  const labelKey = {
    daily: 'date',
    weekly: 'week',
    monthly: 'month'
  }[timeFrame];

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Visitor Traffic</CardTitle>
        <Select
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as 'daily' | 'weekly' | 'monthly')}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={labelKey} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                allowDecimals={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
                name="Visits"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorChart;
