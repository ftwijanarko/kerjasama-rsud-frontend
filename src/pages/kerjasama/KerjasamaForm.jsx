import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getKerjasama, createKerjasama, updateKerjasama,
  getMitraList, getSettingByKey
} from '../../api/api';

export default function KerjasamaForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mitra1Id: '', mitra2Id: '', tipeKerjasama: '', judulKerjasama: '',
    dasarHukumMitra1: '', dasarHukumMitra2: '', dasarHukumRs: '',
    tanggalMulai: '', tanggalSelesai: '', statusKerjasama: '', keterangan: '',
  });

  const [mitraOptions, setMitraOptions] = useState([]);
  const [tipeOptions, setTipeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load dropdown options
    getMitraList().then(res => setMitraOptions(res.data)).catch(console.error);

    getSettingByKey('tipe_kerjasama')
      .then(res => {
        try { setTipeOptions(JSON.parse(res.data.configValue)); } catch { setTipeOptions([]); }
      })
      .catch(() => setTipeOptions(['Kerjasama Manajemen', 'Kerjasama Klinis']));

    getSettingByKey('status_kerjasama')
      .then(res => {
        try { setStatusOptions(JSON.parse(res.data.configValue)); } catch { setStatusOptions([]); }
      })
      .catch(() => setStatusOptions(['Berjalan', 'Perlu Proses Perpanjangan']));

    // Load existing data for edit
    if (isEdit) {
      getKerjasama(id)
        .then((res) => {
          const d = res.data;
          setForm({
            mitra1Id: d.mitra1Id || '',
            mitra2Id: d.mitra2Id || '',
            tipeKerjasama: d.tipeKerjasama || '',
            judulKerjasama: d.judulKerjasama || '',
            dasarHukumMitra1: d.dasarHukumMitra1 || '',
            dasarHukumMitra2: d.dasarHukumMitra2 || '',
            dasarHukumRs: d.dasarHukumRs || '',
            tanggalMulai: d.tanggalMulai || '',
            tanggalSelesai: d.tanggalSelesai || '',
            statusKerjasama: d.statusKerjasama || '',
            keterangan: d.keterangan || '',
          });
        })
        .catch(() => setError('Gagal memuat data kerjasama'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      mitra1Id: Number(form.mitra1Id),
      mitra2Id: form.mitra2Id ? Number(form.mitra2Id) : null,
    };

    try {
      if (isEdit) {
        await updateKerjasama(id, payload);
      } else {
        await createKerjasama(payload);
      }
      navigate('/kerjasama');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Kerjasama' : 'Tambah Kerjasama Baru'}</h1>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Mitra 1 *</label>
              <select name="mitra1Id" value={form.mitra1Id} onChange={handleChange} required>
                <option value="">-- Pilih Mitra 1 --</option>
                {mitraOptions.map(m => (
                  <option key={m.id} value={m.id}>{m.namaMitra}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Mitra 2 (opsional)</label>
              <select name="mitra2Id" value={form.mitra2Id} onChange={handleChange}>
                <option value="">-- Tidak ada --</option>
                {mitraOptions.map(m => (
                  <option key={m.id} value={m.id}>{m.namaMitra}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipe Kerjasama *</label>
              <select name="tipeKerjasama" value={form.tipeKerjasama} onChange={handleChange} required>
                <option value="">-- Pilih Tipe --</option>
                {tipeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status Kerjasama</label>
              <select name="statusKerjasama" value={form.statusKerjasama} onChange={handleChange}>
                <option value="">-- Pilih Status --</option>
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Judul Kerjasama</label>
            <input type="text" name="judulKerjasama" value={form.judulKerjasama} onChange={handleChange}
              placeholder="Masukkan judul kerjasama" />
          </div>

          <div className="form-group">
            <label>Dasar Hukum Mitra 1</label>
            <input type="text" name="dasarHukumMitra1" value={form.dasarHukumMitra1} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Dasar Hukum Mitra 2</label>
            <input type="text" name="dasarHukumMitra2" value={form.dasarHukumMitra2} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Dasar Hukum RS</label>
            <input type="text" name="dasarHukumRs" value={form.dasarHukumRs} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tanggal Mulai *</label>
              <input type="date" name="tanggalMulai" value={form.tanggalMulai} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Tanggal Selesai *</label>
              <input type="date" name="tanggalSelesai" value={form.tanggalSelesai} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Keterangan</label>
            <textarea name="keterangan" value={form.keterangan} onChange={handleChange}
              placeholder="Keterangan tambahan..." />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : (isEdit ? 'Update' : 'Simpan')}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/kerjasama')}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
