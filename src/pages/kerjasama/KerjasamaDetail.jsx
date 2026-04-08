import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getKerjasama, approveKerjasama, rejectKerjasama,
  uploadDokumen, downloadDokumen, deleteDokumen,
  getAuditByKerjasama
} from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { FiEdit2, FiDownload, FiTrash2, FiUpload, FiCheck, FiX, FiEye } from 'react-icons/fi';

export default function KerjasamaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const [detail, setDetail] = useState(null);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null); // { url, type, fileName }

  const fetchDetail = () => {
    setLoading(true);
    getKerjasama(id)
      .then(res => setDetail(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
    if (hasRole('CHECKER', 'ADMIN')) {
      getAuditByKerjasama(id).then(res => setAudits(res.data)).catch(() => {});
    }
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  const handleApprove = async () => {
    if (!window.confirm('Approve kerjasama ini?')) return;
    try {
      await approveKerjasama(id, { action: 'APPROVE', notes: approvalNotes });
      fetchDetail();
      setApprovalNotes('');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal approve');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Reject kerjasama ini?')) return;
    try {
      await rejectKerjasama(id, { action: 'REJECT', notes: approvalNotes });
      fetchDetail();
      setApprovalNotes('');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal reject');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await uploadDokumen(id, formData);
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal upload dokumen');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDownload = async (docId, fileName) => {
    try {
      const res = await downloadDokumen(docId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Gagal download dokumen');
    }
  };

  const isPreviewable = (contentType) => {
    if (!contentType) return false;
    return contentType.startsWith('image/') || contentType === 'application/pdf';
  };

  const handlePreview = async (docId, fileName, contentType) => {
    try {
      const res = await downloadDokumen(docId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }));
      setPreview({ url, type: contentType, fileName });
    } catch {
      alert('Gagal memuat preview dokumen');
    }
  };

  const closePreview = () => {
    if (preview?.url) window.URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm('Hapus dokumen ini?')) return;
    try {
      await deleteDokumen(docId);
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal hapus dokumen');
    }
  };

  if (loading) return <div className="loading">Memuat detail...</div>;
  if (!detail) return <div className="alert alert-error">Data tidak ditemukan.</div>;

  const getApprovalClass = (s) => s ? 'approval-' + s.toLowerCase() : '';

  return (
    <div>
      <div className="page-header">
        <h1>Detail Kerjasama</h1>
        <div className="btn-group">
          {hasRole('MAKER', 'ADMIN') && (
            <button className="btn btn-primary" onClick={() => navigate(`/kerjasama/${id}/edit`)}>
              <FiEdit2 /> Edit
            </button>
          )}
          <button className="btn btn-outline" onClick={() => navigate('/kerjasama')}>← Kembali</button>
        </div>
      </div>

      {/* Detail Info */}
      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>{detail.judulKerjasama || 'Tanpa Judul'}</h3>
        <dl className="detail-grid">
          <dt>Tipe Kerjasama</dt><dd>{detail.tipeKerjasama}</dd>
          <dt>Mitra 1</dt><dd>{detail.mitra1Nama} {detail.mitra1Email ? `(${detail.mitra1Email})` : ''}</dd>
          <dt>Mitra 2</dt><dd>{detail.mitra2Nama || '-'} {detail.mitra2Email ? `(${detail.mitra2Email})` : ''}</dd>
          <dt>Dasar Hukum Mitra 1</dt><dd>{detail.dasarHukumMitra1 || '-'}</dd>
          <dt>Dasar Hukum Mitra 2</dt><dd>{detail.dasarHukumMitra2 || '-'}</dd>
          <dt>Dasar Hukum RS</dt><dd>{detail.dasarHukumRs || '-'}</dd>
          <dt>Tanggal Mulai</dt><dd>{formatDate(detail.tanggalMulai)}</dd>
          <dt>Tanggal Selesai</dt><dd>{formatDate(detail.tanggalSelesai)}</dd>
          <dt>Status Kerjasama</dt>
          <dd><span className={`status-pill status-${(detail.statusKerjasama || 'default').toLowerCase().replace(/ /g, '-')}`}>{detail.statusKerjasama || '-'}</span></dd>
          <dt>Approval</dt>
          <dd><span className={`status-pill ${getApprovalClass(detail.approvalStatus)}`}>{detail.approvalStatus}</span></dd>
          <dt>Catatan Approval</dt><dd>{detail.approvalNotes || '-'}</dd>
          <dt>Keterangan</dt><dd>{detail.keterangan || '-'}</dd>
          <dt>Dibuat oleh</dt><dd>{detail.createdBy || '-'} ({formatDate(detail.createdAt)})</dd>
          <dt>Diupdate oleh</dt><dd>{detail.updatedBy || '-'} ({formatDate(detail.updatedAt)})</dd>
        </dl>
      </div>

      {/* Approval Section (CHECKER/ADMIN) */}
      {hasRole('CHECKER', 'ADMIN') && detail.approvalStatus === 'PENDING' && (
        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>Approval Kerjasama</h3>
          <div className="form-group">
            <label>Catatan Approval</label>
            <textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Tambahkan catatan (opsional)..."
            />
          </div>
          <div className="btn-group">
            <button className="btn btn-success" onClick={handleApprove}><FiCheck /> Approve</button>
            <button className="btn btn-danger" onClick={handleReject}><FiX /> Reject</button>
          </div>
        </div>
      )}

      {/* Documents Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>Dokumen</h3>
          {hasRole('MAKER', 'ADMIN') && (
            <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
              <FiUpload /> {uploading ? 'Mengupload...' : 'Upload Dokumen'}
              <input type="file" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>

        {detail.dokumen && detail.dokumen.length > 0 ? (
          <ul className="doc-list">
            {detail.dokumen.map((doc) => (
              <li key={doc.id} className="doc-item">
                <div className="doc-info">
                  <span className="doc-name">{doc.fileName}</span>
                  <span className="doc-meta">
                    {(doc.fileSize / 1024).toFixed(1)} KB • Diupload oleh {doc.uploadedBy} • {formatDate(doc.uploadedAt)}
                  </span>
                </div>
                <div className="btn-group">
                  {isPreviewable(doc.contentType) && (
                    <button className="btn btn-sm btn-outline" onClick={() => handlePreview(doc.id, doc.fileName, doc.contentType)} title="Preview">
                      <FiEye />
                    </button>
                  )}
                  <button className="btn btn-sm btn-primary" onClick={() => handleDownload(doc.id, doc.fileName)}>
                    <FiDownload />
                  </button>
                  {hasRole('MAKER', 'ADMIN') && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteDoc(doc.id)}>
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>Belum ada dokumen.</p>
        )}
      </div>

      {/* Audit Trail */}
      {hasRole('CHECKER', 'ADMIN') && audits.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>Riwayat Perubahan</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Aksi</th>
                  <th>Oleh</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.performedAt).toLocaleString('id-ID')}</td>
                    <td><span className="status-pill status-default">{a.action}</span></td>
                    <td>{a.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Document Preview Modal */}
      {preview && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-content modal-preview" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{preview.fileName}</h3>
              <button className="btn btn-sm btn-outline" onClick={closePreview}>✕</button>
            </div>
            <div className="modal-body">
              {preview.type === 'application/pdf' ? (
                <iframe src={preview.url} title={preview.fileName} style={{ width: '100%', height: '75vh', border: 'none' }} />
              ) : (
                <img src={preview.url} alt={preview.fileName} style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
