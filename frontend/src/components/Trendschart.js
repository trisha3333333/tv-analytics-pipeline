import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function TrendsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ left: 0, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
        <XAxis dataKey="year_started" tick={{ fill: '#888', fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fill: '#888', fontSize: 12 }} domain={[0, 10]} />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#888', fontSize: 12 }} />
        <Tooltip
          contentStyle={{ background: '#1a1d2e', border: '1px solid #2a2d3a', borderRadius: '8px', color: '#fff' }}
        />
        <Legend wrapperStyle={{ color: '#aaa', fontSize: '13px' }} />
        <Line yAxisId="left" type="monotone" dataKey="avg_rating" stroke="#6c63ff" strokeWidth={2} dot={false} name="Avg Rating" />
        <Line yAxisId="right" type="monotone" dataKey="shows_released" stroke="#f5c518" strokeWidth={2} dot={false} name="Shows Released" />
      </LineChart>
    </ResponsiveContainer>
  );
}
