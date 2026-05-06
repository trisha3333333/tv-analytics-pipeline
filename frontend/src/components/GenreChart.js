import React from 'react';

const BAR_COLORS = ['#6c63ff','#7c73ff','#8c83ff','#9c93ff','#ac93ff','#bc93ff','#cc93ff','#dc93ff','#6c83ff','#6c93ff','#6ca3ff','#6cb3ff','#6cc3ff','#6cd3ff','#6ce3ff'];

export default function GenreChart({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => parseFloat(d.avg_rating)));
  return (
    <div style={{ width: '100%' }}>
      {data.map((item, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: '#ccc' }}>{item.genre_name}</span>
            <span style={{ fontSize: '13px', color: '#aaa' }}>{parseFloat(item.avg_rating).toFixed(2)}</span>
          </div>
          <div style={{ background: '#2a2d3a', borderRadius: '4px', height: '8px', width: '100%' }}>
            <div style={{ background: BAR_COLORS[i % BAR_COLORS.length], height: '8px', borderRadius: '4px', width: `${(parseFloat(item.avg_rating) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
