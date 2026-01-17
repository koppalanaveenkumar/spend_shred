import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Integrations() {
  const [connected, setConnected] = useState({
    gsuite: false,
    quickbooks: false,
    slack: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/connections`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setConnected(prev => ({
            ...prev,
            gsuite: data.google,
            // Map other fields if backend sends them
          }));
        }
      } catch (err) {
        console.error("Failed to fetch connections", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  const handleConnect = (id) => {
    if (connected[id]) return;

    if (id === 'gsuite') {
      window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google/login`;
      return;
    }

    // Mock connection for others
    setConnected(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Integrations</h1>
          <p className="page-subtitle">Connect your financial data sources</p>
        </div>
      </header>

      <div className="integrations-grid">
        <IntegrationCard
          id="gsuite"
          name="Gmail"
          description="Scans receipts, invoices, and 'We miss you' emails to detect Zombies."
          status={connected.gsuite ? 'connected' : 'disconnected'}
          onConnect={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google/login`}
          canScan={true}
        />
        <IntegrationCard
          id="quickbooks"
          name="QuickBooks"
          description="Syncs with your ledger to match bank transactions."
          status={connected.quickbooks ? 'connected' : 'disconnected'}
          isRecommended={true}
          onConnect={() => handleConnect('quickbooks')}
        />
        <IntegrationCard
          id="slack"
          name="Slack"
          description="Analyzes login activity and engagement."
          status={connected.slack ? 'connected' : 'disconnected'}
          onConnect={() => handleConnect('slack')}
        />
      </div>

      <style>{`
        .page-container {
          padding: 32px;
          flex: 1;
          margin-left: 260px;
        }
        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }
      `}</style>
    </div>
  );
}

function IntegrationCard({ name, description, status, isRecommended, onConnect, canScan }) {
  const [connecting, setConnecting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleClick = () => {
    if (status === 'connected') return;
    setConnecting(true);
    // Simulate delay for UI effect, but separate from actual logic
    setTimeout(() => {
      onConnect();
      setConnecting(false);
    }, 1000);
  };

  const handleScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/google/scan`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setScanResult(`Found ${data.found} subscriptions!`);
      } else {
        setScanResult('Scan failed.');
      }
    } catch (e) {
      setScanResult('Error scanning.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="glass-panel integration-card">
      <div className="card-header">
        <h3 className="service-name">{name}</h3>
        {isRecommended && <span className="badge-recommended">Recommended</span>}
      </div>
      <p className="service-desc">{description}</p>

      {scanResult && <div className="scan-result" style={{ marginBottom: 10, fontSize: 13, color: 'var(--accent-success)' }}>{scanResult}</div>}

      <div className="card-footer">
        <div className="status-indicator">
          {status === 'connected' && <span className="status-text success"><CheckCircle size={16} /> Connected</span>}
          {status === 'error' && <span className="status-text error"><AlertCircle size={16} /> Connection Failed</span>}
          {status === 'disconnected' && <span className="status-text muted">Not Connected</span>}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {status === 'connected' && canScan && (
            <button
              className="btn-connect"
              onClick={handleScan}
              disabled={scanning}
              style={{ background: 'var(--accent-primary)', borderColor: 'transparent' }}
            >
              {scanning ? <Loader2 className="spin" size={18} /> : 'Scan Now'}
            </button>
          )}

          <button
            className={`btn-connect ${status}`}
            onClick={handleClick}
            disabled={status === 'connected' || connecting}
          >
            {connecting ? <Loader2 className="spin" size={18} /> : (status === 'connected' ? 'Manage' : 'Connect')}
          </button>
        </div>
      </div>

      <style>{`
        .integration-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .service-name {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        .badge-recommended {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-success);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .service-desc {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0 0 24px;
          line-height: 1.5;
          flex: 1;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .status-text {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
        }
        .status-text.success { color: var(--accent-success); }
        .status-text.error { color: var(--accent-primary); }
        .status-text.muted { color: var(--text-muted); }
        
        .btn-connect {
          background: var(--bg-hover);
          color: white;
          border: 1px solid var(--glass-border);
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 80px;
          display: flex;
          justify-content: center;
        }
        .btn-connect:hover:not(:disabled) {
          background: var(--bg-card);
          border-color: var(--text-muted);
        }
        .btn-connect.connected {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid transparent;
        }
        .btn-connect.connected:hover {
          color: var(--text-primary);
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
