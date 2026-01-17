import React, { useState, useEffect } from 'react';
import { X, Copy, Mail, CheckCircle, ExternalLink } from 'lucide-react';

export default function CancellationModal({ isOpen, onClose, subscription, onConfirmKill }) {
    if (!isOpen || !subscription) return null;

    const [copied, setCopied] = useState(false);

    // Template Generator
    const subject = `Cancellation Request: ${subscription.name} Subscription`;
    const body = `To whom it may concern,

I am writing to formally request the cancellation of our subscription to ${subscription.name}, effective immediately.

Please confirm when this cancellation has been processed and ensure no further future charges are applied to the account properly associated with this email address.

Service: ${subscription.name}
Account Email: ${localStorage.getItem('user') || '[Your Email]'}

Thank you,
${localStorage.getItem('user') || '[Your Name]'}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(`${subject}\n\n${body}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGmail = () => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <div className="modal-header">
                    <h2 className="modal-title">Cancel {subscription.name}</h2>
                    <button className="btn-close" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <p className="instruction-text">
                        Most SaaS apps verify cancellation via email. Use this template to officially requesting cancellation.
                    </p>

                    <div className="email-preview">
                        <div className="email-header">
                            <span className="label">Subject:</span> {subject}
                        </div>
                        <textarea
                            readOnly
                            className="email-body"
                            value={body}
                        />
                    </div>

                    <div className="action-row">
                        <button className="btn-action secondary" onClick={handleCopy}>
                            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                            {copied ? "Copied!" : "Copy Text"}
                        </button>
                        <button className="btn-action secondary" onClick={handleGmail}>
                            <Mail size={16} /> Open in Gmail
                        </button>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Close</button>
                    <button className="btn-confirm-kill" onClick={() => onConfirmKill(subscription.id, subscription.seats_unused)}>
                        <CheckCircle size={18} />
                        Mark as Cancelled
                    </button>
                </div>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          width: 500px;
          max-width: 90vw;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: #1a1a1a;
          border: 1px solid var(--glass-border);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-title { margin: 0; font-size: 20px; font-weight: 600; }
        .btn-close {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .btn-close:hover { color: white; }
        
        .instruction-text {
            color: var(--text-secondary);
            font-size: 14px;
            margin: 0;
        }

        .email-preview {
            background: #0f0f0f;
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 16px;
        }
        .email-header {
            font-size: 13px;
            color: var(--text-primary);
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #333;
            font-weight: 600;
        }
        .label { color: var(--text-muted); font-weight: 400; margin-right: 8px; }
        
        .email-body {
            width: 100%;
            height: 180px;
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-family: monospace;
            font-size: 13px;
            resize: none;
            outline: none;
            line-height: 1.5;
        }

        .action-row {
            display: flex;
            gap: 12px;
        }
        .btn-action {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-action.secondary {
            background: transparent;
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
        }
        .btn-action.secondary:hover {
            border-color: var(--text-muted);
            background: rgba(255,255,255,0.05);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--glass-border);
        }
        .btn-cancel {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 500;
        }
        .btn-cancel:hover { color: white; }
        
        .btn-confirm-kill {
          background: var(--accent-primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-confirm-kill:hover {
          opacity: 0.9;
        }
      `}</style>
        </div>
    );
}
