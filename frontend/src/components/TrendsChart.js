import React from 'react';

export default function TrendsChart({ data }) {
  if (!data || data.length === 0) return null;
  const maxShows = Math.max(...data.map(d => parseInt(d.shows_released) || 0));
  const recent = data.slice(-20);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px', padding: '0 8px' }}>
        {recent.map((item, i) => {
          const height = maxShows > 0 ? (parseInt(item.shows_released) / maxShows) * 180 : 0;
          const rating = parseFloat(item.avg_rating) || 0;
          const ratingColor = rating >= 7.5 ? '#6c63ff' : rating >= 6.5 ? '#8c83ff' : '#ac93ff';
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: '#6c63ff', fontWeight: '600' }}>{rating.toFixed(1)}</span>
              <div style={{ width: '100%', background: ratingColor, borderRadius: '3px 3px 0 0', height: `${height}px`, minHeight: '4px' }} title={`${item.year_started}: ${item.shows_released} shows, avg ${rating}`} />
              <span style={{ fontSize: '9px', color: '#666', transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>{item.year_started}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px', justifyContent: 'center' }}>
        <span style={{ fontSize: '12px', color: '#888' }}>Bar height = shows released · Number = avg rating</span>
      </div>
    </div>
  );
}
