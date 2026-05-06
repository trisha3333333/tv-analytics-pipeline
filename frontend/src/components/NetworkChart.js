import React from 'react';

const BAR_COLORS = ['#f5c518','#f5d018','#f5b018','#f5a018','#f59018','#f58018','#f57018','#e5c518','#d5c518','#c5c518','#b5c518','#a5c518','#95c518','#85c518','#75c518'];

export default function NetworkChart({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => parseInt(d.show_count)));
  return (
    <div style={{ width: '100%' }}>
      {data.map((item, i) => (
        <div key={i} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', color: '#ccc' }}>{item.network_name}</span>
            <span style={{ fontSize: '13px', color: '#aaa' }}>{item.show_count} shows</span>
          </div>
          <div style={{ background: '#2a2d3a', borderRadius: '4px', height: '8px', width: '100%' }}>
            <div style={{ background: BAR_COLORS[i % BAR_COLORS.length], height: '8px', borderRadius: '4px', width: `${(parseInt(item.show_count) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
