import { useState, useEffect } from 'react';
import { getAuditTrails } from '../../api/api';

export default function AuditTrailPage() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAuditTrails()
      .then(res => setAudits(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = audits.filter(a =>
    a.entityType.toLowerCase().includes(search.toLowerCase()) ||
    a.action.toLowerCase().includes(search.toLowerCase()) ||
    (a.performedBy && a.performedBy.toLowerCase().includes(search.toLowerCase()))
  );

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return 'var(--success)';
      case 'UPDATE': return 'var(--accent)';
      case 'DELETE': return 'var(--danger)';
      case 'APPROVE': return 'var(--success)';
      case 'REJECT': return 'var(--danger)';
      default: return 'var(--gray-500)';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Audit Trail</h1>
      </div>

      <div className="controls">
        <input
          type="text"
          className="search-box"
          placeholder="Cari berdasarkan tipe, aksi, atau user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Memuat data...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Tipe Entitas</th>
                  <th>ID Entitas</th>
                  <th>Aksi</th>
                  <th>Dilakukan Oleh</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada data audit trail.</td></tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {new Date(a.performedAt).toLocaleString('id-ID')}
                      </td>
                      <td>{a.entityType}</td>
                      <td>{a.entityId}</td>
                      <td>
                        <span className="status-pill" style={{ backgroundColor: getActionColor(a.action) }}>
                          {a.action}
                        </span>
                      </td>
                      <td>{a.performedBy || '-'}</td>
                      <td>
                        <details>
                          <summary style={{ cursor: 'pointer', color: 'var(--accent)' }}>Lihat</summary>
                          <div style={{ marginTop: '8px', fontSize: '0.85em' }}>
                            {a.oldData && (
                              <div>
                                <strong>Data Lama:</strong>
                                <pre style={{ background: '#fef2f2', padding: '8px', borderRadius: '4px', overflow: 'auto' }}>{a.oldData}</pre>
                              </div>
                            )}
                            {a.newData && (
                              <div>
                                <strong>Data Baru:</strong>
                                <pre style={{ background: '#f0fdf4', padding: '8px', borderRadius: '4px', overflow: 'auto' }}>{a.newData}</pre>
                              </div>
                            )}
                          </div>
                        </details>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
