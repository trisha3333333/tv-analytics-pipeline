import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#f5c518', '#f5d018', '#f5b018', '#f5a018', '#f59018'];

export default function NetworkChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 100, right: 20 }}>
        <XAxis type="number" tick={{ fill: '#888', fontSize: 12 }} />
        <YAxis type="category" dataKey="network_name" tick={{ fill: '#ccc', fontSize: 12 }} width={100} />
        <Tooltip
          contentStyle={{ background: '#1a1d2e', border: '1px solid #2a2d3a', borderRadius: '8px', color: '#fff' }}
          formatter={(val, name) => [val, name === 'show_count' ? 'Shows' : 'Avg Rating']}
        />
        <Bar dataKey="show_count" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
