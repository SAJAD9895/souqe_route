import { useState, useEffect } from 'react';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc
} from 'firebase/firestore';
import { db, LEADS_COLLECTION } from '../lib/firebase';
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
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [resending, setResending] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);

    // Check if already logged in
    useEffect(() => {
        const savedAuth = localStorage.getItem('souqroute_admin_auth');
        if (savedAuth === 'true') {
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
        setLeads([]);
        toast.success('Logged out successfully');
    };

    const computeStats = (rows) => ({
        total: rows.length,
        new: rows.filter(l => l.status === 'new').length,
        contacted: rows.filter(l => l.status === 'contacted').length,
        qualified: rows.filter(l => l.status === 'qualified').length,
        converted: rows.filter(l => l.status === 'converted').length,
        rejected: rows.filter(l => l.status === 'rejected').length
    });

    const fetchLeads = async () => {
        setLoading(true);
        setPermissionDenied(false);
        try {
            const snapshot = await getDocs(
                query(collection(db, LEADS_COLLECTION), orderBy('created_at', 'desc'))
            );
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            if (data.length === 0) {
                toast('No leads found yet.', { icon: 'ℹ️' });
            } else {
                toast.success(`Loaded ${data.length} leads`);
            }

            setLeads(data);
            setStats(computeStats(data));
        } catch (error) {
            console.error('Error fetching leads:', error);
            if (error.code === 'permission-denied') {
                setPermissionDenied(true);
                toast.error('Reading leads is blocked by Firestore security rules.', { duration: 6000 });
            } else {
                toast.error(`Error loading leads: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            await updateDoc(doc(db, LEADS_COLLECTION, leadId), { status: newStatus });

            const updatedLeads = leads.map(lead =>
                lead.id === leadId ? { ...lead, status: newStatus } : lead
            );
            setLeads(updatedLeads);
            setStats(computeStats(updatedLeads));

            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating lead status:', error);
            toast.error(
                error.code === 'permission-denied'
                    ? 'Update blocked by Firestore security rules.'
                    : 'Error updating status. Please try again.'
            );
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreatingUser(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: newUserEmail.trim(),
                password: newUserPassword,
            });

            if (error) throw error;

            toast.success('User account created successfully!');
            setNewUserEmail('');
            setNewUserPassword('');

            // No session back means Supabase is waiting on email confirmation.
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
                email: resendEmail.trim(),
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

    const formatDate = (value) => {
        if (!value) return '-';
        // Firestore Timestamp -> Date; also tolerates ISO strings from old data.
        const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
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
            await deleteDoc(doc(db, LEADS_COLLECTION, leadToDelete.id));

            const updatedLeads = leads.filter(lead => lead.id !== leadToDelete.id);
            setLeads(updatedLeads);
            setStats(computeStats(updatedLeads));

            toast.success('Lead deleted successfully');
            setDeleteModalOpen(false);
            setLeadToDelete(null);
        } catch (error) {
            console.error('Error deleting lead:', error);
            toast.error(
                error.code === 'permission-denied'
                    ? 'Delete blocked by Firestore security rules.'
                    : `Error deleting lead: ${error.message}`
            );
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
                                autoComplete="username"
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
                                autoComplete="current-password"
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
                        ) : permissionDenied ? (
                            <div className="admin-empty">
                                <p><strong>Leads are read-protected.</strong></p>
                                <p>
                                    This login is checked in the browser only, so it gives no
                                    database identity. Firestore rules let the public form submit
                                    leads but allow reads only for an admin UID listed in
                                    <code> isAdmin() </code> in <code>firestore.rules</code>.
                                </p>
                                <p>
                                    View submissions in the{' '}
                                    <a
                                        href="https://console.firebase.google.com/project/souqroute/firestore/databases/-default-/data/~2Fleads"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Firebase console
                                    </a>.
                                </p>
                            </div>
                        ) : leads.length === 0 ? (
                            <div className="admin-empty">
                                <p>No leads found.</p>
                            </div>
                        ) : (
                            <div className="leads-table-container">
                                <table className="leads-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
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
                                        {leads.map((lead, index) => (
                                            <tr key={lead.id}>
                                                <td><strong>{index + 1}</strong></td>
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
                                        placeholder="user@example.com"
                                        autoComplete="off"
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
                                        placeholder="At least 6 characters"
                                        minLength={6}
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="admin-login-btn"
                                    disabled={creatingUser}
                                >
                                    {creatingUser ? 'Creating...' : 'Create Account'}
                                </button>
                            </form>
                        </div>

                        {/* Resend Confirmation Section */}
                        <div className="admin-login-container" style={{ margin: '2rem 0 0', maxWidth: '500px' }}>
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
                                        autoComplete="off"
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
