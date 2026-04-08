import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MitraList from './pages/mitra/MitraList';
import MitraForm from './pages/mitra/MitraForm';
import KerjasamaList from './pages/kerjasama/KerjasamaList';
import KerjasamaForm from './pages/kerjasama/KerjasamaForm';
import KerjasamaDetail from './pages/kerjasama/KerjasamaDetail';
import SettingPage from './pages/setting/SettingPage';
import UserList from './pages/user/UserList';
import UserForm from './pages/user/UserForm';
import AuditTrailPage from './pages/audit/AuditTrailPage';

function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Mitra - MAKER, ADMIN */}
        <Route path="/mitra" element={<ProtectedRoute roles={['MAKER', 'ADMIN']}><MitraList /></ProtectedRoute>} />
        <Route path="/mitra/new" element={<ProtectedRoute roles={['MAKER', 'ADMIN']}><MitraForm /></ProtectedRoute>} />
        <Route path="/mitra/:id/edit" element={<ProtectedRoute roles={['MAKER', 'ADMIN']}><MitraForm /></ProtectedRoute>} />

        {/* Kerjasama - All roles can view */}
        <Route path="/kerjasama" element={<KerjasamaList />} />
        <Route path="/kerjasama/new" element={<ProtectedRoute roles={['MAKER', 'ADMIN']}><KerjasamaForm /></ProtectedRoute>} />
        <Route path="/kerjasama/:id" element={<KerjasamaDetail />} />
        <Route path="/kerjasama/:id/edit" element={<ProtectedRoute roles={['MAKER', 'ADMIN']}><KerjasamaForm /></ProtectedRoute>} />

        {/* Settings - ADMIN only */}
        <Route path="/settings" element={<ProtectedRoute roles={['ADMIN']}><SettingPage /></ProtectedRoute>} />

        {/* Users - ADMIN only */}
        <Route path="/users" element={<ProtectedRoute roles={['ADMIN']}><UserList /></ProtectedRoute>} />
        <Route path="/users/new" element={<ProtectedRoute roles={['ADMIN']}><UserForm /></ProtectedRoute>} />
        <Route path="/users/:id/edit" element={<ProtectedRoute roles={['ADMIN']}><UserForm /></ProtectedRoute>} />

        {/* Audit Trail - CHECKER, ADMIN */}
        <Route path="/audit-trail" element={<ProtectedRoute roles={['CHECKER', 'ADMIN']}><AuditTrailPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
