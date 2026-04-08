import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMitra, createMitra, updateMitra } from '../../api/api';

export default function MitraForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ namaMitra: '', emailMitra: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getMitra(id)
        .then((res) => setForm({ namaMitra: res.data.namaMitra, emailMitra: res.data.emailMitra || '' }))
        .catch(() => setError('Gagal memuat data mitra'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateMitra(id, form);
      } else {
        await createMitra(form);
      }
      navigate('/mitra');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Mitra' : 'Tambah Mitra Baru'}</h1>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Mitra *</label>
            <input
              type="text"
              name="namaMitra"
              value={form.namaMitra}
              onChange={handleChange}
              placeholder="Masukkan nama mitra"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Mitra</label>
            <input
              type="email"
              name="emailMitra"
              value={form.emailMitra}
              onChange={handleChange}
              placeholder="Masukkan email mitra"
            />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan')}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/mitra')}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
