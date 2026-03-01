import React, { useState, useEffect } from 'react';
import { adminAPI, authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'nurse', department: '' });
  const [createMsg, setCreateMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'analytics') fetchAnalytics();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllUsers();
      setUsers(res.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally { setLoading(false); }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally { setLoading(false); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateMsg({ text: '', type: '' });
    try {
      await authAPI.register(newUser);
      setCreateMsg({ text: 'User created successfully!', type: 'success' });
      setNewUser({ name: '', email: '', password: '', role: 'nurse', department: '' });
      fetchUsers();
    } catch (err) {
      setCreateMsg({ text: err.response?.data?.message || 'Failed to create user', type: 'error' });
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-layout">

        {/* ── Top Bar ─────────────────────────────── */}
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Administration</h1>
            <p className="topbar-subtitle">Manage staff, view analytics, and configure the platform</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>System Administrator</div>
            </div>
            <div className="user-avatar" style={{ background: 'linear-gradient(135deg,#a855f7,#4f8ef7)', fontSize: 12 }}>
              {initials}
            </div>
          </div>
        </header>

        {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}

        {/* ── Tab Bar ──────────────────────────────── */}
        <div className="tab-bar">
          {[
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'users', label: 'Staff Members', icon: '👥' },
            { id: 'create', label: 'Add Staff', icon: '➕' },
          ].map(t => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Analytics ────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="fade-in">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                <div className="spinner" style={{ width: 36, height: 36 }} />
              </div>
            ) : analytics ? (
              <>
                {/* Stat grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                  {[
                    { label: 'Total Users', value: analytics.totalUsers, color: 'blue', icon: '👥' },
                    { label: 'Total Patients', value: analytics.totalPatients, color: 'green', icon: '🏥' },
                    { label: 'Total Scans', value: analytics.totalScans, color: 'purple', icon: '🩺' },
                    {
                      label: 'High Infections',
                      value: analytics.infectionStats?.find(s => s._id === 'High Infection')?.count || 0,
                      color: 'red', icon: '⚠️',
                    },
                  ].map((s, i) => (
                    <div key={i} className={`glass-card stat-card ${s.color} fade-in-${i + 1}`}>
                      <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Two-column detail cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                  {/* Infection stats */}
                  <div className="glass-card fade-in-2" style={{ padding: 24 }}>
                    <div className="section-header" style={{ marginBottom: 18 }}>
                      <div>
                        <div className="section-title">🦠 Infection Breakdown</div>
                        <div className="section-subtitle">Distribution across all recorded scans</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(analytics.infectionStats || []).map((s, i) => {
                        const total = analytics.totalScans || 1;
                        const pct = Math.round((s.count / total) * 100);
                        const colorMap = {
                          'Healthy': { bar: 'var(--green)', badge: 'badge-healthy' },
                          'Mild Risk': { bar: 'var(--yellow)', badge: 'badge-mild' },
                          'Medium Infection': { bar: 'var(--orange)', badge: 'badge-medium' },
                          'High Infection': { bar: 'var(--red)', badge: 'badge-high' },
                        };
                        const cm = colorMap[s._id] || { bar: 'var(--blue)', badge: 'badge-active' };
                        return (
                          <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                              <span className={`badge ${cm.badge}`}>{s._id}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                                {s.count} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({pct}%)</span>
                              </span>
                            </div>
                            <div className="progress-bar">
                              <div className="progress-bar-fill" style={{ width: `${pct}%`, background: cm.bar }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Users by role */}
                  <div className="glass-card fade-in-3" style={{ padding: 24 }}>
                    <div className="section-header" style={{ marginBottom: 18 }}>
                      <div>
                        <div className="section-title">👥 Staff by Role</div>
                        <div className="section-subtitle">Active users in each department</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(analytics.usersByRole || []).map((r, i) => {
                        const badgeMap = { admin: 'badge-admin', doctor: 'badge-doctor', nurse: 'badge-nurse' };
                        const iconMap = { admin: '🔑', doctor: '👨‍⚕️', nurse: '👩‍⚕️' };
                        return (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '12px 14px',
                            background: 'rgba(255,255,255,0.025)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                          }}>
                            <span style={{ fontSize: 20 }}>{iconMap[r._id] || '👤'}</span>
                            <div style={{ flex: 1 }}>
                              <span className={`badge ${badgeMap[r._id] || 'badge-active'}`} style={{ textTransform: 'capitalize' }}>
                                {r._id}
                              </span>
                            </div>
                            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{r.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-card">
                <div className="empty-state">
                  <span className="empty-state-icon">📊</span>
                  <div className="empty-state-title">No Analytics Data</div>
                  <div className="empty-state-text">Analytics data will appear once the system has recorded scans.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Users ────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="fade-in">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                <div className="spinner" style={{ width: 36, height: 36 }} />
              </div>
            ) : (
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div className="section-title">All Staff Members</div>
                  <div className="section-subtitle">{users.length} registered users</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="user-avatar" style={{
                                width: 30, height: 30, fontSize: 10,
                                background: u.role === 'admin'
                                  ? 'linear-gradient(135deg,#a855f7,#4f8ef7)'
                                  : u.role === 'doctor'
                                    ? 'linear-gradient(135deg,#4f8ef7,#22d3ee)'
                                    : 'linear-gradient(135deg,#22d3ee,#10b981)',
                              }}>
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600 }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 13 }}>{u.email}</td>
                          <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                          <td style={{ color: 'var(--text-secondary)' }}>{u.department || '—'}</td>
                          <td>
                            <span className={`badge ${u.isActive ? 'badge-active' : 'badge-inactive'}`}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <div className="empty-state">
                      <span className="empty-state-icon">👥</span>
                      <div className="empty-state-title">No users found</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Create User ───────────────────────────── */}
        {activeTab === 'create' && (
          <div className="fade-in" style={{ maxWidth: 520 }}>
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
                <div className="section-title">➕ Create New Staff Account</div>
                <div className="section-subtitle">Grant portal access to a new team member</div>
              </div>
              <div style={{ padding: '24px' }}>
                {createMsg.text && (
                  <div className={`alert ${createMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    <span>{createMsg.type === 'success' ? '✅' : '⚠'}</span>
                    {createMsg.text}
                  </div>
                )}
                <form onSubmit={handleCreateUser}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Full Name</label>
                      <input className="form-input" type="text"
                        value={newUser.name}
                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                        required placeholder="Dr. Jane Smith" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Email Address</label>
                      <input className="form-input" type="email"
                        value={newUser.email}
                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                        required placeholder="jane@hospital.com" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select className="form-input" value={newUser.role}
                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value="nurse">Nurse</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input className="form-input" type="text"
                        value={newUser.department}
                        onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                        placeholder="e.g. Wound Care" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Temporary Password</label>
                      <input className="form-input" type="password"
                        value={newUser.password}
                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                        required placeholder="Min. 8 characters" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}>
                    {loading
                      ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating...</>
                      : '➕ Create Account'
                    }
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;
