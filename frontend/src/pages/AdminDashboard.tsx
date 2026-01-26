import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserRow {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  // Admin dashboard focuses only on users list
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    if (!user.is_admin) {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const resp = await authAPI.getUsers();
      setUsers(resp.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await authAPI.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      console.error('Delete failed', err);
      alert(err.response?.data?.detail || 'Delete failed');
    }
  };

  const handleToggleAdmin = async (id: number, current: boolean) => {
    try {
      await authAPI.toggleAdmin(id, !current);
      setUsers(users.map(u => u.id === id ? { ...u, is_admin: !current } : u));
    } catch (err: any) {
      console.error('Toggle failed', err);
      alert(err.response?.data?.detail || 'Toggle failed');
    }
  };


  
       return (
  <div className="admin-page">
    {/* Header */}
    <div className="admin-header">
      <h2>Admin — User Management</h2>
      <p className="admin-subtitle">
        Manage platform users and administrator privileges
      </p>
    </div>

    {/* Top Controls */}
    <div className="admin-controls">
      <div className="admin-count">
        Total users: <strong>{loading ? '—' : users.length}</strong>
      </div>

      <div className="admin-search">
        <input
          className="input"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={() => {
          setQuery('');
          fetchUsers();
        }}>
          Clear
        </button>
      </div>
    </div>

    {/* Content */}
    {loading ? (
      <div className="admin-loading">Loading users…</div>
    ) : (
      <div className="admin-card">
        <div className="admin-card-header">Registered Users</div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users
                .filter(u => {
                  if (!query) return true;
                  const q = query.toLowerCase();
                  return (
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q)
                  );
                })
                .map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={u.is_admin ? 'badge badge-admin' : 'badge badge-user'}>
                        {u.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button
                        onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                        className="btn btn-sm btn-outline"
                      >
                        {u.is_admin ? 'Revoke Admin' : 'Make Admin'}
                      </button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

      
};

export default AdminDashboard;
