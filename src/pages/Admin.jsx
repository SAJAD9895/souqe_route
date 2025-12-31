import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Admin.css';

function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        rejected: 0
    });

    // Check if already logged in
    useEffect(() => {
        const auth = localStorage.getItem('souqroute_admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    // Fetch leads when authenticated
    useEffect(() => {
        if (isAuthenticated && activeTab === 'leads') {
            fetchLeads();
        }
    }, [isAuthenticated, activeTab]);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');

        // Simple authentication (username: Admin, password: Admin!123)
        if (username === 'Admin' && password === 'Admin!123') {
            setIsAuthenticated(true);
            localStorage.setItem('souqroute_admin_auth', 'true');
        } else {
            setLoginError('Invalid credentials. Please try again.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('souqroute_admin_auth');
        setUsername('');
        setPassword('');
        setActiveTab('dashboard');
    };

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setLeads(data || []);

            // Calculate stats
            const newStats = {
                total: data?.length || 0,
                new: data?.filter(l => l.status === 'new').length || 0,
                contacted: data?.filter(l => l.status === 'contacted').length || 0,
                qualified: data?.filter(l => l.status === 'qualified').length || 0,
                converted: data?.filter(l => l.status === 'converted').length || 0,
                rejected: data?.filter(l => l.status === 'rejected').length || 0
            };
            setStats(newStats);
        } catch (error) {
            console.error('Error fetching leads:', error);
            alert('Error loading leads. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ status: newStatus })
                .eq('id', leadId);

            if (error) throw error;

            // Update local state
            setLeads(prevLeads =>
                prevLeads.map(lead =>
                    lead.id === leadId ? { ...lead, status: newStatus } : lead
                )
            );

            // Recalculate stats
            const updatedLeads = leads.map(lead =>
                lead.id === leadId ? { ...lead, status: newStatus } : lead
            );
            const newStats = {
                total: updatedLeads.length,
                new: updatedLeads.filter(l => l.status === 'new').length,
                contacted: updatedLeads.filter(l => l.status === 'contacted').length,
                qualified: updatedLeads.filter(l => l.status === 'qualified').length,
                converted: updatedLeads.filter(l => l.status === 'converted').length,
                rejected: updatedLeads.filter(l => l.status === 'rejected').length
            };
            setStats(newStats);

        } catch (error) {
            console.error('Error updating lead status:', error);
            alert('Error updating status. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            new: '#3b82f6',
            contacted: '#f59e0b',
            qualified: '#8b5cf6',
            converted: '#10b981',
            rejected: '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="admin-login-page">
                <div className="admin-login-container">
                    <div className="admin-login-header">
                        <h1>SouqRoute Admin</h1>
                        <p>Sign in to access the admin panel</p>
                    </div>
                    <form onSubmit={handleLogin} className="admin-login-form">
                        {loginError && (
                            <div className="admin-login-error">
                                {loginError}
                            </div>
                        )}
                        <div className="admin-form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <button type="submit" className="admin-login-btn">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Admin Dashboard
    return (
        <div className="admin-page">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <h2>SouqRoute</h2>
                    <span>Admin Panel</span>
                </div>
                <nav className="admin-nav">
                    <button
                        className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <span className="nav-icon">📊</span>
                        Dashboard
                    </button>
                    <button
                        className={`admin-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
                        onClick={() => setActiveTab('leads')}
                    >
                        <span className="nav-icon">📋</span>
                        Leads
                    </button>
                </nav>
                <button className="admin-logout-btn" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span>
                    Logout
                </button>
            </div>

            <div className="admin-content">
                <div className="admin-header">
                    <h1>{activeTab === 'dashboard' ? 'Dashboard' : 'Leads Management'}</h1>
                    {activeTab === 'leads' && (
                        <button className="admin-refresh-btn" onClick={fetchLeads}>
                            🔄 Refresh
                        </button>
                    )}
                </div>

                {activeTab === 'dashboard' && (
                    <div className="admin-dashboard">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#3b82f6' }}>📊</div>
                                <div className="stat-info">
                                    <h3>Total Leads</h3>
                                    <p className="stat-number">{stats.total}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#3b82f6' }}>🆕</div>
                                <div className="stat-info">
                                    <h3>New</h3>
                                    <p className="stat-number">{stats.new}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#f59e0b' }}>📞</div>
                                <div className="stat-info">
                                    <h3>Contacted</h3>
                                    <p className="stat-number">{stats.contacted}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#8b5cf6' }}>✅</div>
                                <div className="stat-info">
                                    <h3>Qualified</h3>
                                    <p className="stat-number">{stats.qualified}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#10b981' }}>🎉</div>
                                <div className="stat-info">
                                    <h3>Converted</h3>
                                    <p className="stat-number">{stats.converted}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#ef4444' }}>❌</div>
                                <div className="stat-info">
                                    <h3>Rejected</h3>
                                    <p className="stat-number">{stats.rejected}</p>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-cta">
                            <h2>Welcome to SouqRoute Admin</h2>
                            <p>Click on "Leads" to view and manage all contact form submissions.</p>
                            <button className="cta-btn" onClick={() => setActiveTab('leads')}>
                                View Leads
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="admin-leads">
                        {loading ? (
                            <div className="admin-loading">Loading leads...</div>
                        ) : leads.length === 0 ? (
                            <div className="admin-empty">
                                <p>No leads found.</p>
                            </div>
                        ) : (
                            <div className="leads-table-container">
                                <table className="leads-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Company</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                            <th>Category</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leads.map((lead) => (
                                            <tr key={lead.id}>
                                                <td>{formatDate(lead.created_at)}</td>
                                                <td><strong>{lead.name}</strong></td>
                                                <td>{lead.email}</td>
                                                <td>{lead.company || '-'}</td>
                                                <td>{lead.phone || '-'}</td>
                                                <td>{lead.role || '-'}</td>
                                                <td>{lead.category || '-'}</td>
                                                <td className="message-cell">
                                                    {lead.message || '-'}
                                                </td>
                                                <td>
                                                    <select
                                                        className="status-select"
                                                        value={lead.status || 'new'}
                                                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                        style={{ borderColor: getStatusColor(lead.status) }}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="qualified">Qualified</option>
                                                        <option value="converted">Converted</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;
