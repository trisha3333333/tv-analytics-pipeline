import React from 'react';

const styles = {
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#888', borderBottom: '1px solid #2a2d3a', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '10px 12px', fontSize: '14px', borderBottom: '1px solid #1f2233', color: '#e0e0e0' },
  rating: { color: '#f5c518', fontWeight: '600' },
  badge: { background: '#2a2d3a', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', color: '#aaa' },
  ongoing: { background: '#1a3a2a', color: '#4caf7d', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' },
};

export default function TopShows({ data }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>#</th>
          <th style={styles.th}>Show</th>
          <th style={styles.th}>Rating</th>
          <th style={styles.th}>Votes</th>
          <th style={styles.th}>Year</th>
          <th style={styles.th}>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((show, i) => (
          <tr key={i}>
            <td style={{ ...styles.td, color: '#555', width: '32px' }}>{i + 1}</td>
            <td style={styles.td}>{show.name}</td>
            <td style={{ ...styles.td, ...styles.rating }}>⭐ {parseFloat(show.vote_average).toFixed(2)}</td>
            <td style={{ ...styles.td, color: '#888' }}>{parseInt(show.vote_count).toLocaleString()}</td>
            <td style={{ ...styles.td, color: '#888' }}>{show.year_started || '—'}</td>
            <td style={styles.td}>
              <span style={show.status === 'Returning Series' ? styles.ongoing : styles.badge}>
                {show.status || '—'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
