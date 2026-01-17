import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Shield } from 'lucide-react';

export default function Settings() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        current_password: '',
        new_password: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Determine user name from local storage or decode token (JWT usually has sub=email)
        // For now we just use the stored name if available
        const userName = localStorage.getItem('user');
        if (userName) setFormData(prev => ({ ...prev, full_name: userName }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.new_password && formData.new_password.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...(formData.full_name ? { full_name: formData.full_name } : {}),
                    ...(formData.new_password ? { password: formData.new_password } : {})
                })
            });

            if (!res.ok) throw new Error('Failed to update profile');

            const data = await res.json();

            // Update local storage if name changed
            if (data.user_name) {
                localStorage.setItem('user', data.user_name);
            }
            // Optional: update token if we want to refresh session
            // localStorage.setItem('token', data.access_token);

            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setFormData(prev => ({ ...prev, new_password: '' })); // Clear password field
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Account Settings</h1>
                    <p className="page-subtitle">Manage your profile and security.</p>
                </div>
            </header>

            <div className="settings-grid">
                <div className="settings-card glass-panel">
                    <div className="card-header">
                        <Shield size={20} color="var(--accent-primary)" />
                        <h3>Profile Information</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-icon-wrapper">
                                <User size={16} className="input-icon" />
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                placeholder="user@example.com (Managed by Google)"
                                className="input-disabled"
                            />
                            <small className="hint">Email cannot be changed as it is linked to your Google Account.</small>
                        </div>

                        <div className="form-divider"></div>

                        <div className="card-header" style={{ marginBottom: 24, padding: 0 }}>
                            <Lock size={20} color="var(--accent-primary)" />
                            <h3>Security</h3>
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Leave blank to keep current"
                                value={formData.new_password}
                                onChange={e => setFormData({ ...formData, new_password: e.target.value })}
                            />
                        </div>

                        {message.text && (
                            <div className={`message-banner ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={
                                    loading ||
                                    (formData.full_name === localStorage.getItem('user') && !formData.new_password) ||
                                    (formData.new_password && formData.new_password.length < 8)
                                }
                            >
                                <Save size={18} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
        .page-container {
            padding: 32px;
            margin-left: 260px;
        }
        .settings-grid {
            max-width: 600px;
        }
        .settings-card {
            padding: 32px;
        }
        .card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 32px;
        }
        .card-header h3 {
            margin: 0;
            font-size: 18px;
        }
        .form-group {
            margin-bottom: 24px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: var(--text-secondary);
            font-size: 14px;
        }
        .input-icon-wrapper {
            position: relative;
        }
        .input-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
        }
        .settings-form input {
            width: 100%;
            padding: 10px 12px;
            background: var(--bg-hover);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            color: white;
            box-sizing: border-box; 
        }
        .settings-form input.input-disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .input-icon-wrapper input {
            padding-left: 40px;
        }
        .hint {
            display: block;
            margin-top: 6px;
            font-size: 12px;
            color: var(--text-muted);
        }
        .form-divider {
            height: 1px;
            background: var(--glass-border);
            margin: 32px 0;
        }
        .form-actions {
            display: flex;
            justify-content: flex-end;
        }
        .btn-primary {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 24px;
        }
        .message-banner {
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 24px;
            text-align: center;
        }
        .message-banner.success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent-success);
            border: 1px solid var(--accent-success);
        }
        .message-banner.error {
            background: rgba(255, 77, 77, 0.1);
            color: var(--accent-primary);
            border: 1px solid var(--accent-primary);
        }
        .btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: var(--bg-hover);
        }
      `}</style>
        </div>
    );
}
