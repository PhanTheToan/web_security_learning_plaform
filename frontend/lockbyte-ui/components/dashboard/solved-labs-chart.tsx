"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

export function SolvedLabsChart({ solvedLabs }) {
  const { theme } = useTheme();

  const data = solvedLabs.reduce((acc, lab) => {
    const month = new Date(lab.completedAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    const existingMonth = acc.find((item) => item.month === month);
    if (existingMonth) {
      existingMonth.count += 1;
    } else {
      acc.push({ month, count: 1 });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            borderColor: theme === 'dark' ? '#555' : '#ccc',
          }}
        />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Labs Solved" />
      </BarChart>
    </ResponsiveContainer>
  );
}
