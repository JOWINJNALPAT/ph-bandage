import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'nurse', department: '' });
  const [createMessage, setCreateMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'analytics') fetchAnalytics();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally { setLoading(false); }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally { setLoading(false); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateMessage('');
    try {
      await authAPI.register(newUser);
      setCreateMessage('✅ User created successfully');
      setNewUser({ name: '', email: '', password: '', role: 'nurse', department: '' });
      fetchUsers();
    } catch (err) {
      setCreateMessage(`❌ ${err.response?.data?.message || 'Failed to create user'}`);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="dashboard-layout">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Admin Dashboard</h1>
            <p className="topbar-subtitle">Manage users, view analytics, and configure the system.</p>
          </div>
          <button onClick={handleLogout} className="btn-danger">Logout</button>
        </header>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        {/* Tabs */}
        <div className="flex gap-6 mb-6">
          <button onClick={() => setActiveTab('analytics')} className={`btn-ghost ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : ''}`}>📊 Analytics</button>
          <button onClick={() => setActiveTab('users')} className={`btn-ghost ${activeTab === 'users' ? 'bg-blue-600 text-white' : ''}`}>👥 Users</button>
          <button onClick={() => setActiveTab('create')} className={`btn-ghost ${activeTab === 'create' ? 'bg-blue-600 text-white' : ''}`}>➕ Create User</button>
        </div>
        {/* Content */}
        {activeTab === 'analytics' && (
          <section className="fade-in">
            {loading ? (
              <div className="spinner" />
            ) : analytics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card stat-card blue">
                  <div className="stat-label">Total Users</div>
                  <div className="stat-value">{analytics.totalUsers}</div>
                </div>
                <div className="glass-card stat-card green">
                  <div className="stat-label">Total Patients</div>
                  <div className="stat-value">{analytics.totalPatients}</div>
                </div>
                <div className="glass-card stat-card purple">
                  <div className="stat-label">Total Scans</div>
                  <div className="stat-value">{analytics.totalScans}</div>
                </div>
                <div className="glass-card stat-card red">
                  <div className="stat-label">High Infections</div>
                  <div className="stat-value">{analytics.infectionStats.find(s => s._id === 'High Infection')?.count || 0}</div>
                </div>
                <div className="glass-card" style={{ gridColumn: 'span 4' }}>
                  <h2 className="text-xl font-semibold mb-4">Infection Statistics</h2>
                  <ul className="space-y-2">
                    {analytics.infectionStats.map(s => (
                      <li key={s._id} className="flex justify-between items-center">
                        <span>{s._id}</span>
                        <span className="font-medium">{s.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card" style={{ gridColumn: 'span 4' }}>
                  <h2 className="text-xl font-semibold mb-4">Users by Role</h2>
                  <ul className="space-y-2">
                    {analytics.usersByRole.map(r => (
                      <li key={r._id} className="flex justify-between items-center">
                        <span className="capitalize">{r._id}s</span>
                        <span className="font-medium">{r.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </section>
        )}
        {activeTab === 'users' && (
          <section className="fade-in">
            {loading ? (
              <div className="spinner" />
            ) : (
              <div className="glass-card">
                <h2 className="text-xl font-semibold mb-4">All Users</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-white/5">
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                        <td>{u.department || '-'}</td>
                        <td><span className={`badge ${u.isActive ? 'badge-active' : 'badge-inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        {activeTab === 'create' && (
          <section className="fade-in">
            <div className="glass-card max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">Create New User</h2>
              {createMessage && (
                <div className={createMessage.includes('✅') ? 'alert alert-success' : 'alert alert-error'}>{createMessage}</div>
              )}
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="form-label">Name</label>
                  <input className="form-input" type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Role</label>
                  <select className="form-input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input className="form-input" type="text" value={newUser.department} onChange={e => setNewUser({ ...newUser, department: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>Create User</button>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
