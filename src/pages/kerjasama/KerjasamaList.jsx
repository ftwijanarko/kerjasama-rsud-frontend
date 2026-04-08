import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getKerjasamaList, deleteKerjasama } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEye, FiTrash2 } from 'react-icons/fi';

export default function KerjasamaList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const filterStatus = searchParams.get('status');
  const filterTipe = searchParams.get('tipe');

  const fetchData = (keyword) => {
    setLoading(true);
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterTipe) params.tipe = filterTipe;
    if (keyword) params.search = keyword;

    getKerjasamaList(params)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filterStatus, filterTipe]);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus data kerjasama ini?')) return;
    try {
      await deleteKerjasama(id);
      fetchData(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  const getStatusClass = (status) => {
    if (!status) return 'status-default';
    return 'status-' + status.toLowerCase().replace(/ /g, '-');
  };

  const getApprovalClass = (status) => {
    if (!status) return '';
    return 'approval-' + status.toLowerCase();
  };

  const title = filterStatus
    ? `Kerjasama: ${filterStatus}`
    : filterTipe
    ? `Kerjasama: ${filterTipe}`
    : 'Daftar Kerjasama';

  return (
    <div>
      <div className="page-header">
        <h1>{title}</h1>
        {hasRole('MAKER', 'ADMIN') && (
          <Link to="/kerjasama/new" className="btn btn-primary"><FiPlus /> Tambah Kerjasama</Link>
        )}
      </div>

      <div className="controls">
        <input
          type="text"
          className="search-box"
          placeholder="Cari berdasarkan judul atau nama mitra..."
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
                  <th>No</th>
                  <th>Mitra 1</th>
                  <th>Judul</th>
                  <th>Tipe</th>
                  <th>Tgl Selesai</th>
                  <th>Status</th>
                  <th>Approval</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center' }}>Tidak ada data.</td></tr>
                ) : (
                  data.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td>{item.mitra1?.namaMitra || '-'}</td>
                      <td>{item.judulKerjasama || '-'}</td>
                      <td>{item.tipeKerjasama}</td>
                      <td>{formatDate(item.tanggalSelesai)}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(item.statusKerjasama)}`}>
                          {item.statusKerjasama || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${getApprovalClass(item.approvalStatus)}`}>
                          {item.approvalStatus}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-primary" onClick={() => navigate(`/kerjasama/${item.id}`)}>
                            <FiEye />
                          </button>
                          {hasRole('ADMIN') && (
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
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
