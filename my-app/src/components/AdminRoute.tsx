import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/" replace />;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.role !== 'admin') return <Navigate to="/dashboard" replace />;
  } catch {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}