import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, createUser, updateUser } from '../../api/api';

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '', password: '', fullName: '', email: '', role: 'MAKER', active: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getUser(id)
        .then(res => {
          const u = res.data;
          setForm({
            username: u.username,
            password: '',
            fullName: u.fullName || '',
            email: u.email || '',
            role: u.role,
            active: u.active,
          });
        })
        .catch(() => setError('Gagal memuat data user'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) {
        delete payload.password;
      }
      if (isEdit) {
        await updateUser(id, payload);
      } else {
        await createUser(payload);
      }
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Edit User' : 'Tambah User Baru'}</h1>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                disabled={isEdit}
              />
            </div>
            <div className="form-group">
              <label>{isEdit ? 'Password (kosongkan jika tidak diubah)' : 'Password *'}</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required={!isEdit}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role *</label>
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="MAKER">MAKER</option>
                <option value="CHECKER">CHECKER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '30px' }}>
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} id="active-check" />
              <label htmlFor="active-check" style={{ margin: 0 }}>User Aktif</label>
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan')}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/users')}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
