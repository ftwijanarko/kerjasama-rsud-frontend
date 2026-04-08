import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMitraList, deleteMitra } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function MitraList() {
  const [mitraList, setMitraList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const fetchData = (keyword) => {
    setLoading(true);
    getMitraList(keyword || undefined)
      .then((res) => setMitraList(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus mitra "${name}"?`)) return;
    try {
      await deleteMitra(id);
      fetchData(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus mitra');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Data Mitra</h1>
        <Link to="/mitra/new" className="btn btn-primary"><FiPlus /> Tambah Mitra</Link>
      </div>

      <div className="controls">
        <input
          type="text"
          className="search-box"
          placeholder="Cari mitra..."
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
                  <th>Nama Mitra</th>
                  <th>Email</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mitraList.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center' }}>Tidak ada data mitra.</td></tr>
                ) : (
                  mitraList.map((mitra, i) => (
                    <tr key={mitra.id}>
                      <td>{i + 1}</td>
                      <td>{mitra.namaMitra}</td>
                      <td>{mitra.emailMitra || '-'}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-primary" onClick={() => navigate(`/mitra/${mitra.id}/edit`)}>
                            <FiEdit2 />
                          </button>
                          {hasRole('ADMIN') && (
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(mitra.id, mitra.namaMitra)}>
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
