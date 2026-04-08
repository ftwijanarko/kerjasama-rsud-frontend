import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummary } from '../api/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setSummary(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Memuat dashboard...</div>;

  if (!summary) return <div className="alert alert-error">Gagal memuat data dashboard.</div>;

  const statusCards = summary.byStatus ? Object.entries(summary.byStatus) : [];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard Reminder Kerjasama</h1>
      </div>

      <div className="stat-grid">
        <div className="stat-card" onClick={() => navigate('/kerjasama')}>
          <h3>Total Kerjasama</h3>
          <div className="stat-value">{summary.totalKerjasama}</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/kerjasama?tipe=Kerjasama Klinis')}>
          <h3>Kerjasama Klinis</h3>
          <div className="stat-value">{summary.totalKlinis}</div>
        </div>
        <div className="stat-card" onClick={() => navigate('/kerjasama?tipe=Kerjasama Manajemen')}>
          <h3>Kerjasama Manajemen</h3>
          <div className="stat-value">{summary.totalManajemen}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <h3>Menunggu Approval</h3>
          <div className="stat-value">{summary.pendingApproval}</div>
        </div>

        {statusCards.map(([status, count]) => (
          <div
            key={status}
            className="stat-card"
            onClick={() => navigate(`/kerjasama?status=${encodeURIComponent(status)}`)}
          >
            <h3>{status}</h3>
            <div className="stat-value">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
