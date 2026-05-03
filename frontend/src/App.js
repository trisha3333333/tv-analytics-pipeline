import React, { useState, useEffect, lazy, Suspense } from 'react';
const TopShows = lazy(() => import('./components/TopShows'));
const GenreChart = lazy(() => import('./components/GenreChart'));
const NetworkChart = lazy(() => import('./components/NetworkChart'));
const TrendsChart = lazy(() => import('./components/TrendsChart'));

// Replace this with your actual API Gateway URL after deploying Lambda
const API_URL = process.env.REACT_APP_API_URL || 'https://9g7x9w3k91.execute-api.us-east-2.amazonaws.com';

const fetchData = async (query) => {
  const res = await fetch(`${API_URL}?query=${query}`);
  return res.json();
};

const styles = {
  app: { minHeight: '100vh', background: '#0f1117', padding: '24px' },
  header: { marginBottom: '32px', borderBottom: '1px solid #2a2d3a', paddingBottom: '16px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#888', },
  stats: { display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' },
  statCard: { background: '#1a1d2e', borderRadius: '12px', padding: '20px 28px', flex: '1', minWidth: '160px', borderLeft: '3px solid #6c63ff' },
  statValue: { fontSize: '32px', fontWeight: '700', color: '#6c63ff' },
  statLabel: { fontSize: '13px', color: '#888', marginTop: '4px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  gridFull: { marginBottom: '20px' },
  card: { background: '#1a1d2e', borderRadius: '12px', padding: '20px' },
  cardTitle: { fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' },
  loading: { textAlign: 'center', padding: '80px', color: '#888', fontSize: '18px' },
};

export default function App() {
  const [topShows, setTopShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [trends, setTrends] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchData('top_shows'),
      fetchData('genre_ratings'),
      fetchData('top_networks'),
      fetchData('trends_by_year'),
      fetchData('status_breakdown'),
    ]).then(([shows, g, n, t, s]) => {
      setTopShows(shows);
      setGenres(g);
      setNetworks(n);
      setTrends(t);
      setStatus(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={styles.loading}>Loading analytics...</div>;

  const totalShows = topShows.length > 0 ? '900+' : '-';
  const avgRating = genres.length > 0
    ? (genres.reduce((a, b) => a + parseFloat(b.avg_rating), 0) / genres.length).toFixed(2)
    : '-';
  const totalNetworks = networks.length;

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.title}>📺 TV Show Ratings Analytics</div>
        <div style={styles.subtitle}>Powered by TMDB API · AWS S3 · Athena · Lambda · React</div>
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>900+</div>
          <div style={styles.statLabel}>Shows Analyzed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{avgRating}</div>
          <div style={styles.statLabel}>Avg Genre Rating</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalNetworks}</div>
          <div style={styles.statLabel}>Networks Tracked</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{genres.length}</div>
          <div style={styles.statLabel}>Genres Covered</div>
        </div>
      </div>

      <div style={styles.gridFull}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>📈 Rating Trends by Year</div>
          <Suspense fallback={<div style={{color:'#888'}}>Loading...</div>}>
            <TrendsChart data={trends} />
          </Suspense>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>🎭 Average Rating by Genre</div>
          <Suspense fallback={<div style={{color:'#888'}}>Loading...</div>}>
            <GenreChart data={genres} />
          </Suspense>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>📡 Top Networks by Show Count</div>
          <Suspense fallback={<div style={{color:'#888'}}>Loading...</div>}>
            <NetworkChart data={networks} />
          </Suspense>
        </div>
      </div>

      <div style={styles.gridFull}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>⭐ Top Rated Shows</div>
          <Suspense fallback={<div style={{color:'#888'}}>Loading...</div>}>
            <TopShows data={topShows} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
