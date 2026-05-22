import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div style={styles.root}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Admin Panel</p>
            <h1 style={styles.title}>User Management</h1>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Log out</button>
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {loading && <p style={styles.muted}>Loading users...</p>}

        {!loading && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Email', 'Role', 'Joined', 'Action'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...(user.role === 'admin' ? styles.badgeAdmin : styles.badgeUser) }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ ...styles.td, ...styles.muted }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      {user.role !== 'admin' && (
                        <button onClick={() => deleteUser(user.id)} style={styles.deleteBtn}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: '100vh', backgroundColor: '#0a0a0f', color: '#e8e8ec', fontFamily: "'DM Sans', system-ui, sans-serif", padding: '2rem' },
  container: { maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  eyebrow: { fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6EE7B7', marginBottom: '0.5rem' },
  title: { fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: '#f0f0f4', margin: 0 },
  logoutBtn: { backgroundColor: 'transparent', border: '1px solid #1e1e2e', borderRadius: '8px', padding: '8px 16px', color: '#8888a0', cursor: 'pointer', fontSize: '13px' },
  error: { color: '#f87171', backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem' },
  muted: { color: '#8888a0', fontSize: '14px' },
  tableWrapper: { border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 500, color: '#5a5a72', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: '#111118', borderBottom: '1px solid #1e1e2e' },
  tr: { borderBottom: '1px solid #1e1e2e' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#e8e8ec' },
  badge: { display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  badgeAdmin: { backgroundColor: 'rgba(110,231,183,0.1)', color: '#6EE7B7' },
  badgeUser: { backgroundColor: '#1a1a28', color: '#8888a0' },
  deleteBtn: { backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '6px', padding: '5px 12px', color: '#f87171', cursor: 'pointer', fontSize: '12px', fontWeight: 500 },
};