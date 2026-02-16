import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);

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
            toast.success('Welcome back, Admin! 👋');
        } else {
            setLoginError('Invalid credentials. Please try again.');
            toast.error('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('souqroute_admin_auth');
        setUsername('');
        setPassword('');
        setActiveTab('dashboard');
        toast.success('Logged out successfully');
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
            toast.success(`Loaded ${data?.length || 0} leads`);
        } catch (error) {
            console.error('Error fetching leads:', error);
            toast.error('Error loading leads. Please try again.');
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

            toast.success(`Status updated to ${newStatus}`);

        } catch (error) {
            console.error('Error updating lead status:', error);
            toast.error('Error updating status. Please try again.');
        }
    };

    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [resending, setResending] = useState(false);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreatingUser(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: newUserEmail,
                password: newUserPassword,
            });

            if (error) throw error;

            toast.success('User account created successfully!');
            setNewUserEmail('');
            setNewUserPassword('');

            // If email confirmation is required, show a note
            if (data.user && !data.session) {
                toast('Please check email for confirmation if required.', {
                    icon: 'ℹ️',
                });
            }

        } catch (error) {
            console.error('Error creating user:', error);
            toast.error(error.message || 'Error creating user account');
        } finally {
            setCreatingUser(false);
        }
    };

    const handleResendConfirmation = async (e) => {
        e.preventDefault();
        setResending(true);

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: resendEmail,
            });

            if (error) throw error;

            toast.success('Confirmation email resent!');
            setResendEmail('');
        } catch (error) {
            console.error('Error resending confirmation:', error);
            toast.error(error.message || 'Error resending email');
        } finally {
            setResending(false);
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

    const handleDeleteClick = (lead) => {
        setLeadToDelete(lead);
        setDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
        setLeadToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!leadToDelete) return;

        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', leadToDelete.id);

            if (error) throw error;

            // Update local state
            setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadToDelete.id));

            // Recalculate stats
            const updatedLeads = leads.filter(lead => lead.id !== leadToDelete.id);
            const newStats = {
                total: updatedLeads.length,
                new: updatedLeads.filter(l => l.status === 'new').length,
                contacted: updatedLeads.filter(l => l.status === 'contacted').length,
                qualified: updatedLeads.filter(l => l.status === 'qualified').length,
                converted: updatedLeads.filter(l => l.status === 'converted').length,
                rejected: updatedLeads.filter(l => l.status === 'rejected').length
            };
            setStats(newStats);

            toast.success('Lead deleted successfully');
            setDeleteModalOpen(false);
            setLeadToDelete(null);

        } catch (error) {
            console.error('Error deleting lead:', error);
            toast.error('Error deleting lead. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            new: '#000000',      // Black
            contacted: '#666666', // Gray
            qualified: '#E21323', // Red
            converted: '#E21323', // Red
            rejected: '#ADADAD'   // Light Gray
        };
        return colors[status] || '#ADADAD';
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="admin-login-page">
                <div className="admin-login-container">
                    <div className="admin-login-header">
                        <img src="/images/logo-black.png" alt="Souq Route" className="admin-login-logo" />
                        <h1>Admin Panel</h1>
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
                    <img src="/images/logo-white.png" alt="Souq Route" className="admin-sidebar-logo" />
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
                    <button
                        className={`admin-nav-item ${activeTab === 'create-account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create-account')}
                    >
                        <span className="nav-icon">👤</span>
                        Create Account
                    </button>
                </nav>
                <button className="admin-logout-btn" onClick={handleLogout}>
                    <span className="nav-icon">🚪</span>
                    Logout
                </button>
            </div>

            <div className="admin-content">
                <div className="admin-header">
                    <h1>
                        {activeTab === 'dashboard' && 'Dashboard'}
                        {activeTab === 'leads' && 'Leads Management'}
                        {activeTab === 'create-account' && 'Create Account'}
                    </h1>
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
                                <div className="stat-icon" style={{ background: 'var(--color-black)' }}>📊</div>
                                <div className="stat-info">
                                    <h3>Total Leads</h3>
                                    <p className="stat-number" style={{ color: 'var(--color-black)' }}>{stats.total}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'var(--color-black)' }}>🆕</div>
                                <div className="stat-info">
                                    <h3>New</h3>
                                    <p className="stat-number" style={{ color: 'var(--color-black)' }}>{stats.new}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'var(--color-gray)' }}>📞</div>
                                <div className="stat-info">
                                    <h3>Contacted</h3>
                                    <p className="stat-number" style={{ color: 'var(--color-black)' }}>{stats.contacted}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'var(--color-red)' }}>✅</div>
                                <div className="stat-info">
                                    <h3>Qualified</h3>
                                    <p className="stat-number" style={{ color: 'var(--color-black)' }}>{stats.qualified}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: 'var(--color-red)' }}>🎉</div>
                                <div className="stat-info">
                                    <h3>Converted</h3>
                                    <p className="stat-number" style={{ color: 'var(--color-black)' }}>{stats.converted}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#333333' }}>❌</div>
                                <div className="stat-info">
                                    <h3>Rejected</h3>
                                    <p className="stat-number" style={{ color: 'var(--color-black)' }}>{stats.rejected}</p>
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
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Company</th>
                                            <th>Business Activity</th>
                                            <th>Brands</th>
                                            <th>Phone</th>
                                            <th>Mobile</th>
                                            <th>Email</th>
                                            <th>Website</th>
                                            <th>Office No</th>
                                            <th>Building</th>
                                            <th>Street</th>
                                            <th>Locality</th>
                                            <th>P.O. Box</th>
                                            <th>City</th>
                                            <th>Country</th>
                                            <th>Message</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leads.map((lead) => (
                                            <tr key={lead.id}>
                                                <td><strong>#{lead.id}</strong></td>
                                                <td className="nowrap">{formatDate(lead.created_at)}</td>
                                                <td><strong>{lead.first_name || '-'}</strong></td>
                                                <td><strong>{lead.last_name || '-'}</strong></td>
                                                <td>{lead.company || '-'}</td>
                                                <td>{lead.business_activity || '-'}</td>
                                                <td className="truncate">{lead.brands_represented || '-'}</td>
                                                <td className="nowrap">{lead.phone || '-'}</td>
                                                <td className="nowrap">{lead.mobile_number || '-'}</td>
                                                <td>{lead.email || '-'}</td>
                                                <td className="truncate">{lead.website || '-'}</td>
                                                <td>{lead.office_no || '-'}</td>
                                                <td>{lead.building_name || '-'}</td>
                                                <td>{lead.street || '-'}</td>
                                                <td>{lead.locality || '-'}</td>
                                                <td>{lead.po_box || '-'}</td>
                                                <td>{lead.city || '-'}</td>
                                                <td>{lead.country || '-'}</td>
                                                <td className="message-cell">{lead.message || '-'}</td>
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
                                                <td>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteClick(lead)}
                                                        title="Delete lead"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'create-account' && (
                    <div className="admin-create-account">
                        <div className="admin-login-container" style={{ margin: '0 0', maxWidth: '500px' }}>
                            <div className="admin-login-header">
                                <h2>Create New User</h2>
                                <p>Create a new account for accessing the platform.</p>
                            </div>
                            <form onSubmit={handleCreateUser} className="admin-login-form">
                                <div className="admin-form-group">
                                    <label htmlFor="newUserEmail">Email Address</label>
                                    <input
                                        type="email"
                                        id="newUserEmail"
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label htmlFor="newUserPassword">Password</label>
                                    <input
                                        type="password"
                                        id="newUserPassword"
                                        value={newUserPassword}
                                        onChange={(e) => setNewUserPassword(e.target.value)}
                                        placeholder="Enter password (min 6 chars)"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <button type="submit" className="admin-login-btn" disabled={creatingUser}>
                                    {creatingUser ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>
                        </div>

                        {/* Resend Confirmation Section */}
                        <div className="admin-login-container" style={{ margin: '32px 0 0 0', maxWidth: '500px' }}>
                            <div className="admin-login-header">
                                <h2>Resend Confirmation</h2>
                                <p>Link expired? Resend confirmation email.</p>
                            </div>
                            <form onSubmit={handleResendConfirmation} className="admin-login-form">
                                <div className="admin-form-group">
                                    <label htmlFor="resendEmail">Unverified Account Email</label>
                                    <input
                                        type="email"
                                        id="resendEmail"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        placeholder="Enter email to resend link"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="admin-login-btn"
                                    disabled={resending}
                                    style={{ background: 'var(--color-gray)' }}
                                >
                                    {resending ? 'Sending...' : 'Resend Email'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="modal-overlay" onClick={handleCancelDelete}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>⚠️ Confirm Delete</h2>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this lead?</p>
                            {leadToDelete && (
                                <div className="lead-details">
                                    <p><strong>Name:</strong> {leadToDelete.first_name} {leadToDelete.last_name}</p>
                                    <p><strong>Company:</strong> {leadToDelete.company || 'N/A'}</p>
                                    <p><strong>Email:</strong> {leadToDelete.email || 'N/A'}</p>
                                    <p><strong>Phone:</strong> {leadToDelete.phone || 'N/A'}</p>
                                </div>
                            )}
                            <p className="warning-text">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={handleCancelDelete}>
                                Cancel
                            </button>
                            <button className="btn-delete" onClick={handleConfirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;
