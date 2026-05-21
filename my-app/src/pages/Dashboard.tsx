import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', color: '#e8e8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <h1>Dashboard</h1>
      <p style={{ color: '#8888a0' }}>Your job applications will appear here.</p>
      <button onClick={handleLogout} style={{ backgroundColor: '#6EE7B7', color: '#0a0a0f', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>
        Log out
      </button>
    </div>
  );
}