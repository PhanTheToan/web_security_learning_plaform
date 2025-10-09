'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Day 1', solves: 40 },
  { name: 'Day 2', solves: 30 },
  { name: 'Day 3', solves: 50 },
  { name: 'Day 4', solves: 45 },
  { name: 'Day 5', solves: 60 },
  { name: 'Day 6', solves: 70 },
  { name: 'Day 7', solves: 90 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/50 p-3 rounded-lg">
        <p className="label text-sm text-gray-300">{`${label}`}</p>
        <p className="intro text-white font-bold">{`Solves : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export function ActivityChart() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/30 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Lab Solves in Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.2)" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="solves"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{
              r: 4,
              fill: '#a855f7',
              stroke: '#f3e8ff',
              strokeWidth: 2,
            }}
            activeDot={{ r: 8, fill: '#a855f7' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
