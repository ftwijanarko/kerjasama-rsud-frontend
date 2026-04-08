import { useState, useEffect } from 'react';
import { getSettings, createSetting, updateSetting, deleteSetting } from '../../api/api';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

export default function SettingPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ configKey: '', configValue: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = () => {
    setLoading(true);
    getSettings()
      .then(res => setSettings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleAdd = async () => {
    setError('');
    if (!form.configKey || !form.configValue) {
      setError('Semua field wajib diisi');
      return;
    }
    try {
      await createSetting(form);
      setForm({ configKey: '', configValue: '' });
      setShowAdd(false);
      fetchSettings();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah setting');
    }
  };

  const handleEdit = (setting) => {
    setEditingId(setting.id);
    setForm({ configKey: setting.configKey, configValue: setting.configValue });
  };

  const handleUpdate = async () => {
    setError('');
    try {
      await updateSetting(editingId, form);
      setEditingId(null);
      setForm({ configKey: '', configValue: '' });
      fetchSettings();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal update setting');
    }
  };

  const handleDelete = async (id, key) => {
    if (!window.confirm(`Hapus setting "${key}"?`)) return;
    try {
      await deleteSetting(id);
      fetchSettings();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal hapus setting');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm({ configKey: '', configValue: '' });
    setError('');
  };

  return (
    <div>
      <div className="page-header">
        <h1>Pengaturan Platform</h1>
        <button className="btn btn-primary" onClick={() => { setShowAdd(true); setEditingId(null); setForm({ configKey: '', configValue: '' }); }}>
          <FiPlus /> Tambah Setting
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Add/Edit form */}
      {(showAdd || editingId) && (
        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>{editingId ? 'Edit Setting' : 'Tambah Setting Baru'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Config Key</label>
              <input
                type="text"
                value={form.configKey}
                onChange={(e) => setForm({ ...form, configKey: e.target.value })}
                placeholder="contoh: reminder_days_before"
                disabled={Boolean(editingId)}
              />
            </div>
            <div className="form-group">
              <label>Config Value</label>
              <input
                type="text"
                value={form.configValue}
                onChange={(e) => setForm({ ...form, configValue: e.target.value })}
                placeholder='contoh: 90 atau ["value1","value2"]'
              />
            </div>
          </div>
          <div className="btn-group">
            <button className="btn btn-success" onClick={editingId ? handleUpdate : handleAdd}>
              <FiSave /> Simpan
            </button>
            <button className="btn btn-outline" onClick={cancelEdit}>
              <FiX /> Batal
            </button>
          </div>
        </div>
      )}

      {/* Settings table */}
      <div className="card">
        {loading ? (
          <div className="loading">Memuat data...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Config Key</th>
                  <th>Config Value</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {settings.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>Tidak ada setting.</td></tr>
                ) : (
                  settings.map((s) => (
                    <tr key={s.id}>
                      <td><code>{s.configKey}</code></td>
                      <td style={{ maxWidth: '400px', wordBreak: 'break-all' }}>{s.configValue}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEdit(s)}><FiEdit2 /></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id, s.configKey)}><FiTrash2 /></button>
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

      <div className="card" style={{ background: '#f8f9fa' }}>
        <h3 style={{ marginBottom: '8px' }}>Panduan Setting</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#555' }}>
          <li><code>tipe_kerjasama</code> — Daftar tipe kerjasama dalam format JSON array, contoh: <code>["Kerjasama Manajemen", "Kerjasama Klinis"]</code></li>
          <li><code>status_kerjasama</code> — Daftar status kerjasama dalam format JSON array</li>
          <li><code>reminder_days_before</code> — Jumlah hari sebelum tanggal selesai untuk mengirim email reminder (default: 90)</li>
        </ul>
      </div>
    </div>
  );
}
