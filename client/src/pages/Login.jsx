import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ChevronRight, X } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      onLogin();
      navigate('/dashboard');
    }
  }, [navigate, onLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store in localStorage (MVP approach)
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', data.user_name);

      onLogin(); // Update global auth state
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel" style={{ position: 'relative' }}>
        <Link to="/" className="btn-close-auth">
          <X size={24} />
        </Link>
        <div className="login-header">
          <h1>SpendShred</h1>
          <p>Sign in to your command center</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={16} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'} <ChevronRight size={16} />
          </button>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 10%, #1a1a2e 0%, #000 100%);
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          border-radius: 16px;
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #fff 0%, #aaa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .login-header p {
          color: var(--text-secondary);
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 8px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-wrapper svg {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }
        .input-wrapper input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: 0.2s;
        }
        .input-wrapper input:focus {
          border-color: var(--accent-primary);
          background: rgba(255,255,255,0.08);
        }
        .error-message {
          color: var(--accent-primary);
          font-size: 14px;
          text-align: center;
          margin-bottom: 16px;
          background: rgba(255, 77, 77, 0.1);
          padding: 8px;
          border-radius: 6px;
        }
        .btn-block {
          width: 100%;
          justify-content: center;
          padding: 12px;
        }
        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .auth-footer a {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 500;
        }
        .auth-footer a:hover {
          text-decoration: underline;
        }
        .btn-close-auth {
            position: absolute;
            top: 20px;
            right: 20px;
            color: var(--text-muted);
            transition: color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        .btn-close-auth:hover {
            color: white;
            background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
}
