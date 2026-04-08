import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../api/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Hapus user "${username}"?`)) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus user');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Manajemen User</h1>
        <Link to="/users/new" className="btn btn-primary"><FiPlus /> Tambah User</Link>
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
                  <th>Username</th>
                  <th>Nama Lengkap</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center' }}>Tidak ada data user.</td></tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td>{u.username}</td>
                      <td>{u.fullName || '-'}</td>
                      <td>{u.email || '-'}</td>
                      <td><span className="status-pill" style={{ background: 'var(--accent)' }}>{u.role}</span></td>
                      <td>
                        <span className={`status-pill ${u.active ? 'approval-approved' : 'approval-rejected'}`}>
                          {u.active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-primary" onClick={() => navigate(`/users/${u.id}/edit`)}>
                            <FiEdit2 />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id, u.username)}>
                            <FiTrash2 />
                          </button>
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
