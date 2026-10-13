import { useState, useEffect, useCallback } from 'react';
import {
    LEAD_STATUSES,
    deleteLead,
    isWebsiteAdmin,
    listLeads,
    updateLeadStatus as updateLeadStatusInDb
} from '../lib/leads';
import {
    DEFAULT_SUPABASE_ENV,
    SUPABASE_ENVS,
    getSupabaseAdminClient,
    getSupabaseClient,
    getSupabaseEnv,
    getSupabaseProjectRef
} from '../lib/supabaseClient';
import ProductManager from '../components/ProductManager';
import toast from 'react-hot-toast';
import './Admin.css';

const EMPTY_STATS = {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    rejected: 0
};

const computeStats = (rows) => ({
    total: rows.length,
    new: rows.filter(l => l.status === 'new').length,
    contacted: rows.filter(l => l.status === 'contacted').length,
    qualified: rows.filter(l => l.status === 'qualified').length,
    converted: rows.filter(l => l.status === 'converted').length,
    rejected: rows.filter(l => l.status === 'rejected').length
});

function Admin() {
    // Supabase Auth session for the selected project. Each project has its own
    // accounts, so the session is per env: switching the Database picker to a
    // project you are not signed in to shows the login screen for it.
    const [session, setSession] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    // 'checking' | 'admin' | 'denied' — whether the signed-in user is listed
    // in website_admins. Sign-ups are open, so a session alone proves nothing.
    const [adminStatus, setAdminStatus] = useState('checking');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [signingIn, setSigningIn] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(EMPTY_STATS);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [resending, setResending] = useState(false);
    // Which Supabase project the whole panel reads, writes and signs in to.
    // Chosen in the header, remembered across reloads, and defaulted to test so
    // a mis-click never lands in the live database.
    const [supabaseEnv, setSupabaseEnv] = useState(() => {
        const saved = localStorage.getItem('souqroute_supabase_env');
        return SUPABASE_ENVS.some((env) => env.id === saved) ? saved : DEFAULT_SUPABASE_ENV;
    });

    useEffect(() => {
        localStorage.setItem('souqroute_supabase_env', supabaseEnv);
    }, [supabaseEnv]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);

    // Restore / track the session for the selected project. Supabase persists
    // it in localStorage under a per-env key (see getSupabaseAdminClient).
    useEffect(() => {
        let client;
        try {
            client = getSupabaseAdminClient(supabaseEnv);
        } catch (error) {
            console.error(error);
            setSession(null);
            setAuthReady(true);
            return undefined;
        }

        let cancelled = false;
        setAuthReady(false);
        setLeads([]);
        setStats(EMPTY_STATS);

        client.auth.getSession().then(({ data }) => {
            if (cancelled) return;
            setSession(data.session);
            setAuthReady(true);
        });

        const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
            if (!cancelled) setSession(nextSession);
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [supabaseEnv]);

    const userId = session?.user?.id;

    // Check the allowlist whenever the signed-in user (or project) changes.
    useEffect(() => {
        if (!userId) {
            setAdminStatus('checking');
            return undefined;
        }

        let cancelled = false;
        setAdminStatus('checking');
        isWebsiteAdmin(supabaseEnv)
            .then((ok) => { if (!cancelled) setAdminStatus(ok ? 'admin' : 'denied'); })
            .catch((error) => {
                console.error('Admin check failed:', error);
                if (!cancelled) setAdminStatus('denied');
            });

        return () => { cancelled = true; };
    }, [userId, supabaseEnv]);

    const isAdmin = adminStatus === 'admin';

    const fetchLeads = useCallback(async ({ quiet = false } = {}) => {
        setLoading(true);
        try {
            const data = await listLeads(supabaseEnv);

            if (!quiet) {
                if (data.length === 0) {
                    toast('No leads found yet.', { icon: 'ℹ️' });
                } else {
                    toast.success(`Loaded ${data.length} leads`);
                }
            }

            setLeads(data);
            setStats(computeStats(data));
        } catch (error) {
            console.error('Error fetching leads:', error);
            // PGRST205 / 42P01 = table missing: website_leads.sql was never run.
            if (error.code === 'PGRST205' || error.code === '42P01') {
                toast.error('The website_leads table does not exist in this project. Run supabase/website_leads.sql.', { duration: 8000 });
            } else {
                toast.error(`Error loading leads: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }, [supabaseEnv]);

    // Leads feed both the Dashboard stats and the Leads table.
    useEffect(() => {
        if (!isAdmin) return;
        if (activeTab === 'leads') fetchLeads();
        else if (activeTab === 'dashboard') fetchLeads({ quiet: true });
    }, [isAdmin, activeTab, fetchLeads]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setSigningIn(true);

        try {
            const client = getSupabaseAdminClient(supabaseEnv);
            const { data, error } = await client.auth.signInWithPassword({
                email: email.trim(),
                password
            });
            if (error) throw error;

            // Refuse accounts that aren't on the allowlist up front, rather than
            // leaving them signed in to an empty panel.
            const ok = await isWebsiteAdmin(supabaseEnv);
            if (!ok) {
                await client.auth.signOut();
                setLoginError(`${data.user.email} is not an admin in ${getSupabaseEnv(supabaseEnv).label}.`);
                toast.error('This account is not an admin');
                return;
            }

            setPassword('');
            toast.success('Welcome back, Admin! 👋');
        } catch (error) {
            console.error('Sign-in failed:', error);
            setLoginError(error.message || 'Invalid credentials. Please try again.');
            toast.error('Invalid credentials');
        } finally {
            setSigningIn(false);
        }
    };

    const handleLogout = async () => {
        await getSupabaseAdminClient(supabaseEnv).auth.signOut();
        setPassword('');
        setActiveTab('dashboard');
        setLeads([]);
        setStats(EMPTY_STATS);
        toast.success('Logged out successfully');
    };

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            await updateLeadStatusInDb(supabaseEnv, leadId, newStatus);

            const updatedLeads = leads.map(lead =>
                lead.id === leadId ? { ...lead, status: newStatus } : lead
            );
            setLeads(updatedLeads);
            setStats(computeStats(updatedLeads));

            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating lead status:', error);
            toast.error(error.message || 'Error updating status. Please try again.');
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreatingUser(true);

        try {
            const target = getSupabaseEnv(supabaseEnv);
            const { data, error } = await getSupabaseClient(supabaseEnv).auth.signUp({
                email: newUserEmail.trim(),
                password: newUserPassword,
            });

            if (error) throw error;

            toast.success(`Account created in ${target.label}!`);
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
            const target = getSupabaseEnv(supabaseEnv);
            const { error } = await getSupabaseClient(supabaseEnv).auth.resend({
                type: 'signup',
                email: resendEmail.trim(),
            });

            if (error) throw error;

            toast.success(`Confirmation email resent from ${target.label}!`);
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
        const date = new Date(value);
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
            await deleteLead(supabaseEnv, leadToDelete.id);

            const updatedLeads = leads.filter(lead => lead.id !== leadToDelete.id);
            setLeads(updatedLeads);
            setStats(computeStats(updatedLeads));

            toast.success('Lead deleted successfully');
            setDeleteModalOpen(false);
            setLeadToDelete(null);
        } catch (error) {
            console.error('Error deleting lead:', error);
            toast.error(`Error deleting lead: ${error.message}`);
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

    const envPicker = (
        <div className={`admin-env-switch ${supabaseEnv === 'live' ? 'is-live' : ''}`}>
            <label htmlFor="supabaseEnv">Database</label>
            <select
                id="supabaseEnv"
                value={supabaseEnv}
                onChange={(e) => setSupabaseEnv(e.target.value)}
            >
                {SUPABASE_ENVS.map((env) => (
                    <option key={env.id} value={env.id}>
                        {env.label}
                    </option>
                ))}
            </select>
            <code>{getSupabaseProjectRef(supabaseEnv)}</code>
        </div>
    );

    if (!authReady || (session && adminStatus === 'checking')) {
        return (
            <div className="admin-login-page">
                <div className="admin-loading">Checking session...</div>
            </div>
        );
    }

    // Signed in, but not on the website_admins allowlist for this project.
    if (session && adminStatus === 'denied') {
        return (
            <div className="admin-login-page">
                <div className="admin-login-container">
                    <div className="admin-login-header">
                        <img src="/images/logo-black.png" alt="Souq Route" className="admin-login-logo" />
                        <h1>Not an admin</h1>
                        <p>
                            <strong>{session.user.email}</strong> is signed in to{' '}
                            {getSupabaseEnv(supabaseEnv).label}, but is not listed in{' '}
                            <code>website_admins</code> for that project.
                        </p>
                    </div>
                    <div className="admin-login-form">
                        {envPicker}
                        <button type="button" className="admin-login-btn" onClick={handleLogout}>
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Login Screen
    if (!session) {
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
                        {envPicker}
                        <div className="admin-form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@souqroute.com"
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
                        <button type="submit" className="admin-login-btn" disabled={signingIn}>
                            {signingIn ? 'Signing in...' : 'Sign In'}
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
                        className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <span className="nav-icon">📦</span>
                        Products
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
                        {activeTab === 'products' && 'Products'}
                        {activeTab === 'create-account' && 'Create Account'}
                    </h1>
                    <div className="admin-header-actions">
                        {/* Panel-wide Supabase target. Leads, Products and Create
                            Account all read this, so there is one place to check
                            which database you are about to write to. */}
                        {envPicker}
                        {activeTab === 'leads' && (
                            <button className="admin-refresh-btn" onClick={() => fetchLeads()}>
                                🔄 Refresh
                            </button>
                        )}
                    </div>
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
                                            <th>Product</th>
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
                                                    {lead.product ? (
                                                        <div className="lead-product">
                                                            {lead.product.image_primary_url && (
                                                                <img src={lead.product.image_primary_url} alt="" />
                                                            )}
                                                            <span>{lead.product.name}</span>
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    <select
                                                        className="status-select"
                                                        value={lead.status || 'new'}
                                                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                        style={{ borderColor: getStatusColor(lead.status) }}
                                                    >
                                                        {LEAD_STATUSES.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                                            </option>
                                                        ))}
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

                {activeTab === 'products' && (
                    // Remounts on env change so the panel never shows one
                    // database's products while pointed at the other.
                    <ProductManager key={supabaseEnv} env={supabaseEnv} />
                )}

                {activeTab === 'create-account' && (
                    <div className="admin-create-account">
                        <div className="admin-login-container" style={{ margin: '0 0', maxWidth: '500px' }}>
                            <div className="admin-login-header">
                                <h2>Create New User</h2>
                                <p>Create a new account for accessing the platform.</p>
                            </div>
                            <form onSubmit={handleCreateUser} className="admin-login-form">
                                <p className={`admin-env-hint ${supabaseEnv === 'live' ? 'is-live' : ''}`}>
                                    {supabaseEnv === 'live'
                                        ? 'Live project — this creates a real account.'
                                        : 'Staging project — safe for test accounts.'}
                                    {' '}Target: <code>{getSupabaseProjectRef(supabaseEnv)}</code>
                                    {' '}— change it with the Database picker above.
                                </p>
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
                                <p>
                                    Link expired? Resend confirmation email. Uses the
                                    environment selected above — currently{' '}
                                    <strong>{getSupabaseEnv(supabaseEnv).label}</strong>.
                                </p>
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
