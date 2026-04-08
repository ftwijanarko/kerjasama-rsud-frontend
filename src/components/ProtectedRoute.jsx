import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles, children }) {
  const { user, hasRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRole(...roles)) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <h2>⛔ Akses Ditolak</h2>
        <p style={{ marginTop: '10px', color: '#666' }}>
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
      </div>
    );
  }

  return children;
}
