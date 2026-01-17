import React, { useState, useEffect } from 'react';
import { Ghost, Trash2, Search, Filter, AlertTriangle, Check, X, Plus, Pencil, Download } from 'lucide-react';
import AddSubscriptionModal from '../components/AddSubscriptionModal';
import CancellationModal from '../components/CancellationModal';
import { TableSkeleton } from '../components/Skeletons';

export default function ReaperList() {
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('cost-desc'); // 'cost-desc', 'cost-asc', 'name-asc'
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKillModalOpen, setIsKillModalOpen] = useState(false);
  const [selectedSubForKill, setSelectedSubForKill] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions`);
      const data = await res.json();
      setSubscriptions(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const [selectedSubForEdit, setSelectedSubForEdit] = useState(null); // New state

  // ... fetchSubscriptions ...

  const handleSave = async (subData) => {
    try {
      if (subData.id) {
        // Update existing
        await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions/${subData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subData)
        });
      } else {
        // Create new
        await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subData)
        });
      }
      fetchSubscriptions();
      setIsModalOpen(false);
      setSelectedSubForEdit(null);
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  const openAddModal = () => {
    setSelectedSubForEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sub) => {
    setSelectedSubForEdit(sub);
    setIsModalOpen(true);
  };

  const openKillModal = (sub) => {
    setSelectedSubForKill(sub);
    setIsKillModalOpen(true);
  };

  const handleConfirmKill = async (id, unusedSeats) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', seats_unused: 0 })
      });
      setIsKillModalOpen(false); // Close modal
      fetchSubscriptions(); // Refresh list
    } catch (error) {
      console.error("Failed to kill", error);
    }
  };

  const filteredSubs = subscriptions.filter(sub => {
    if (filter === 'all') return true;
    if (filter === 'zombie') return sub.status === 'zombie' || sub.status === 'critical';
    return sub.status === 'active';
  }).sort((a, b) => {
    switch (sortOrder) {
      case 'cost-desc': return b.amount - a.amount;
      case 'cost-asc': return a.amount - b.amount;
      case 'name-asc': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--accent-success)';
      case 'zombie': return 'var(--accent-secondary)';
      case 'critical': return 'var(--accent-primary)';
      case 'cancelled': return 'var(--text-muted)';
      default: return 'var(--text-muted)';
    }
  };

  // if (loading) return <div style={{ padding: 32, marginLeft: 260 }}>Loading...</div>;

  const handleExport = () => {
    const headers = ['Name', 'Team', 'Cost', 'Seats Total', 'Seats Unused', 'Status', 'Last Active'];
    const csvContent = [
      headers.join(','),
      ...subscriptions.map(sub => [
        `"${sub.name}"`, // Quote strings to handle commas
        `"${sub.team}"`,
        sub.amount,
        sub.seats_total,
        sub.seats_unused,
        sub.status,
        `"${sub.last_used}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'spendshred_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">The Shred List</h1>
          <p className="page-subtitle">Identify and eliminate waste.</p>
        </div>
        <div className="actions">
          <div className="filter-group">
            <select
              className="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="cost-desc">Cost: High to Low</option>
              <option value="cost-asc">Cost: Low to High</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
            <button className={`btn-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`btn-filter ${filter === 'zombie' ? 'active' : ''}`} onClick={() => setFilter('zombie')}>Zombies</button>
          </div>
          <button className="btn-filter" onClick={handleExport}><Download size={14} /> Export</button>
          <button className="btn-filter" onClick={() => window.location.reload()}><Search size={14} /> Refresh</button>
          <button className="btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Add
          </button>
        </div>
      </header>

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleSave}
        initialData={selectedSubForEdit}
      />

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={isKillModalOpen}
        onClose={() => setIsKillModalOpen(false)}
        subscription={selectedSubForKill}
        onConfirmKill={handleConfirmKill}
      />


      <div className="reaper-table-container glass-panel">
        {loading ? (
          <TableSkeleton />
        ) : filteredSubs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Ghost size={48} color="var(--text-muted)" />
            </div>
            <h3>No subscriptions found</h3>
            <p>Connect Gmail to automatically scan for receipts, or add one manually.</p>
            <div className="empty-actions">
              <button className="btn-primary" onClick={openAddModal}>
                <Plus size={16} /> Add Manually
              </button>
            </div>
          </div>
        ) : (
          <table className="reaper-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Team</th>
                <th>Monthly Cost</th>
                <th>Seat Utilization</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map(sub => (
                <tr key={sub.id} className={`row-${sub.status}`}>
                  <td className="col-name">
                    <div className="service-icon">{sub.name[0]}</div>
                    <div>
                      <div className="name-text">{sub.name}</div>
                      <div className="sub-text">Last active: {sub.last_used}</div>
                    </div>
                  </td>
                  <td>{sub.team}</td>
                  <td>${sub.amount}</td>
                  <td>
                    <div className="seat-meter">
                      <div className="meter-bar">
                        <div
                          className="meter-fill"
                          style={{
                            width: `${((sub.seats_total - sub.seats_unused) / sub.seats_total) * 100}%`,
                            background: sub.seats_unused > 0 ? 'var(--accent-secondary)' : 'var(--accent-success)'
                          }}
                        />
                      </div>
                      <span className="meter-text">{sub.seats_total - sub.seats_unused}/{sub.seats_total} used</span>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge" style={{ color: getStatusColor(sub.status), borderColor: getStatusColor(sub.status) }}>
                      {sub.status === 'zombie' && <Ghost size={12} />}
                      {sub.status === 'critical' && <AlertTriangle size={12} />}
                      {sub.status === 'active' && <Check size={12} />}
                      {sub.status === 'cancelled' && <X size={12} />}
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {sub.status === 'cancelled' ? (
                      <span className="text-safe">Cancelled</span>
                    ) : sub.seats_unused > 0 ? (
                      <button className="btn-kill" onClick={() => openKillModal(sub)}>
                        <Trash2 size={14} />
                        Kill {sub.seats_unused}
                      </button>
                    ) : (
                      <span className="text-safe">Safe</span>
                    )}
                    <button className="btn-icon-only" onClick={() => openEditModal(sub)} title="Edit">
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .page-container {
          padding: 32px;
          flex: 1;
          margin-left: 260px;
        }
        .reaper-table-container {
          overflow: hidden;
        }
        .reaper-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .reaper-table th {
          padding: 16px 24px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid var(--glass-border);
        }
        .reaper-table td {
          padding: 16px 24px;
          border-bottom: 1px solid var(--glass-border);
          vertical-align: middle;
        }
        .reaper-table tr:last-child td {
          border-bottom: none;
        }
        
        .col-name {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .service-icon {
          width: 32px;
          height: 32px;
          background: var(--bg-hover);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--text-primary);
        }
        .name-text { font-weight: 600; color: var(--text-primary); }
        .sub-text { font-size: 12px; color: var(--text-muted); }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid;
          font-size: 11px;
          font-weight: 600;
          background: rgba(0,0,0,0.2);
        }

        .btn-kill {
          background: rgba(255, 77, 77, 0.1);
          color: var(--accent-primary);
          border: 1px solid var(--accent-primary);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .btn-kill:hover {
          background: var(--accent-primary);
          color: white;
        }
        .btn-icon-only {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            margin-left: 8px;
            vertical-align: middle;
        }
        .btn-icon-only:hover {
            background: var(--bg-hover);
            color: var(--text-primary);
        }
        .text-safe {
          color: var(--text-muted);
          font-size: 12px;
        }

        .seat-meter {
          width: 120px;
        }
        .meter-bar {
          height: 6px;
          background: var(--bg-hover);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .meter-fill {
          height: 100%;
          border-radius: 3px;
        }
        .meter-text {
          font-size: 11px;
          color: var(--text-muted);
        }
        
        .actions {
          display: flex;
          gap: 12px;
        }
        .btn-filter {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-filter:hover {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }
        .btn-filter.active {
            background: var(--bg-hover);
            color: var(--text-primary);
            border-color: var(--accent-primary);
        }

        .filter-group {
            display: flex;
            gap: 8px;
            padding-right: 12px;
            border-right: 1px solid var(--glass-border);
            margin-right: 12px;
        }

        .sort-select {
            background: var(--bg-card);
            color: var(--text-secondary);
            border: 1px solid var(--glass-border);
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 13px;
            cursor: pointer;
            outline: none;
        }
        .sort-select:hover {
            border-color: var(--text-muted);
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 64px 24px;
            text-align: center;
        }
        .empty-icon {
            background: var(--bg-hover);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
        }
        .empty-state h3 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0 0 8px 0;
        }
        .empty-state p {
            color: var(--text-secondary);
            font-size: 14px;
            margin: 0 0 24px 0;
            max-width: 400px;
        }
      `}</style>
    </div >
  );
}
