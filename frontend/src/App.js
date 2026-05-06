import React, { useState, useEffect } from 'react';
import TopShows from './components/TopShows';
import GenreChart from './components/GenreChart';
import NetworkChart from './components/NetworkChart';
import TrendsChart from './components/TrendsChart';

const API_URL = process.env.REACT_APP_API_URL || 'https://9g7x9w3k91.execute-api.us-east-2.amazonaws.com';

const s = {
  app: { minHeight: '100vh', background: '#0f1117', padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#e0e0e0' },
  header: { marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #2a2d3a' },
  title: { fontSize: '26px', fontWeight: '700', color: '#fff', marginBottom: '4px' },
  sub: { fontSize: '13px', color: '#666' },
  stats: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  stat: { background: '#1a1d2e', borderRadius: '10px', padding: '16px 24px', flex: '1', minWidth: '140px', borderLeft: '3px solid #6c63ff' },
  statVal: { fontSize: '28px', fontWeight: '700', color: '#6c63ff' },
  statLbl: { fontSize: '12px', color: '#888', marginTop: '2px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  full: { marginBottom: '16px' },
  card: { background: '#1a1d2e', borderRadius: '10px', padding: '18px' },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '14px' },
  err: { color: '#ff6b6b', padding: '40px', textAlign: 'center', fontSize: '16px' },
};

export default function App() {
  const [data, setData] = useState({ topShows: [], genres: [], networks: [], trends: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const queries = ['top_shows', 'genre_ratings', 'top_networks', 'trends_by_year'];
        const results = await Promise.all(
          queries.map(q =>
            fetch(`${API_URL}?query=${q}`)
              .then(r => r.json())
              .catch(() => [])
          )
        );
        setData({
          topShows: Array.isArray(results[0]) ? results[0] : [],
          genres: Array.isArray(results[1]) ? results[1] : [],
          networks: Array.isArray(results[2]) ? results[2] : [],
          trends: Array.isArray(results[3]) ? results[3] : [],
        });
      } catch (e) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div style={{ ...s.app, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📺</div>
        <div style={{ fontSize: '18px', color: '#888' }}>Loading analytics...</div>
      </div>
    </div>
  );

  if (error) return <div style={s.app}><div style={s.err}>{error}</div></div>;

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={s.title}>📺 TV Show Ratings Analytics</div>
        <div style={s.sub}>TMDB API · AWS S3 · Athena · Lambda · React · AWS Amplify</div>
      </div>

      <div style={s.stats}>
        <div style={s.stat}><div style={s.statVal}>900+</div><div style={s.statLbl}>Shows Analyzed</div></div>
        <div style={s.stat}><div style={s.statVal}>{data.genres.length}</div><div style={s.statLbl}>Genres Tracked</div></div>
        <div style={s.stat}><div style={s.statVal}>{data.networks.length}</div><div style={s.statLbl}>Networks Covered</div></div>
        <div style={s.stat}><div style={s.statVal}>
          {data.genres.length > 0
            ? (data.genres.reduce((a, b) => a + parseFloat(b.avg_rating || 0), 0) / data.genres.length).toFixed(2)
            : '—'}
        </div><div style={s.statLbl}>Avg Genre Rating</div></div>
      </div>

      <div style={s.full}>
        <div style={s.card}>
          <div style={s.cardTitle}>📈 Shows Released & Avg Rating by Year</div>
          <TrendsChart data={data.trends} />
        </div>
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.cardTitle}>🎭 Avg Rating by Genre</div>
          <GenreChart data={data.genres} />
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>📡 Top Networks by Show Count</div>
          <NetworkChart data={data.networks} />
        </div>
      </div>

      <div style={s.full}>
        <div style={s.card}>
          <div style={s.cardTitle}>⭐ Top Rated Shows</div>
          <TopShows data={data.topShows} />
        </div>
      </div>
    </div>
  );
}
