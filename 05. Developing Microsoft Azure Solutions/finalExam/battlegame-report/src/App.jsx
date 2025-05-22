// src/App.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function App() {
  const [playerId, setPlayerId] = useState(1);
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const fetchAssets = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/getAssetsByPlayer?playerId=${id}`);
      setRows(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets(playerId);
  }, [playerId]);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Player Asset Report</h1>

      <label>
        Choose Player ID:{' '}
        <select
          value={playerId}
          onChange={(e) => setPlayerId(+e.target.value)}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </label>

      {loading && <p>Loading…</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <p>No assets found for player {playerId}.</p>
      )}

      {rows.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{ marginTop: 20, borderCollapse: 'collapse' }}
        >
          <thead>
            <tr style={{ background: '#eee', color: '#333' }}>
              <th>No</th>
              <th>Player Name</th>
              <th>Level</th>
              <th>Age</th>
              <th>Asset Name</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.PlayerName}</td>
                <td>{r.Level}</td>
                <td>{r.Age}</td>
                <td>{r.AssetName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
