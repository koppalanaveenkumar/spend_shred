import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function AddSubscriptionModal({ isOpen, onClose, onAdd, initialData }) {
    const isEditing = !!initialData;

    const [formData, setFormData] = useState({
        name: '',
        team: 'Unassigned',
        amount: '',
        seats_total: 1,
        seats_unused: 0
    });

    // Populate form data when modal opens or initialData changes
    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    team: initialData.team || 'Unassigned',
                    amount: initialData.amount,
                    seats_total: initialData.seats_total,
                    seats_unused: initialData.seats_unused
                });
            } else {
                // Reset for "Add" mode
                setFormData({ name: '', team: 'Unassigned', amount: '', seats_total: 1, seats_unused: 0 });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            ...(initialData || {}), // Preserve ID if editing
            ...formData,
            amount: parseFloat(formData.amount),
            seats_total: parseInt(formData.seats_total),
            seats_unused: parseInt(formData.seats_unused),
            // Only force status logic if adding new or if logic demands it, 
            // but for simple edit, maybe we let status recalibrate or keep existing?
            // For now, let's recalibrate status based on unused seats
            status: parseInt(formData.seats_unused) > 0 ? 'zombie' : 'active',
            last_used: initialData ? initialData.last_used : 'Just now'
        });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <div className="modal-header">
                    <h3>{isEditing ? 'Edit Subscription' : 'Add Subscription'}</h3>
                    <button onClick={onClose} className="btn-close"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Service Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Jira"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Team</label>
                            <input
                                type="text"
                                placeholder="e.g. Engineering"
                                value={formData.team}
                                onChange={e => setFormData({ ...formData, team: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Monthly Cost ($)</label>
                            <input
                                required
                                type="number"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Total Seats</label>
                            <input
                                required
                                type="number"
                                min="1"
                                value={formData.seats_total}
                                onChange={e => setFormData({ ...formData, seats_total: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Unused Seats</label>
                            <input
                                required
                                type="number"
                                min="0"
                                value={formData.seats_unused}
                                onChange={e => setFormData({ ...formData, seats_unused: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-primary">{isEditing ? 'Save Changes' : 'Add Subscription'}</button>
                    </div>
                </form>
            </div>
            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    padding: 24px;
                    background: var(--bg-card);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .modal-header h3 { margin: 0; }
                .btn-close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }
                .btn-close:hover { color: var(--text-primary); }
                
                .form-group { margin-bottom: 16px; }
                .form-row { display: flex; gap: 16px; }
                .form-row .form-group { flex: 1; }
                
                label {
                    display: block;
                    font-size: 13px;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                }
                input {
                    box-sizing: border-box; 
                    width: 100%;
                    padding: 10px;
                    background: var(--bg-hover);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: var(--text-primary);
                    font-family: inherit;
                }
                input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                }
                
                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 24px;
                }
                .btn-cancel {
                    background: transparent;
                    border: 1px solid var(--glass-border);
                    color: var(--text-secondary);
                    padding: 10px 20px;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                }
                .btn-cancel:hover { color: var(--text-primary); }
            `}</style>
        </div >
    );
}
