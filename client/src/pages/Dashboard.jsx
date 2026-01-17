import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_spend: 0,
    wasted_spend: 0,
    active_subs: 0,
    zombie_count: 0,
    health_score: 0
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats", err));
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Command Center</h1>
          <p className="page-subtitle">Overview of your SaaS ecosystem</p>
        </div>
        <div className="date-badge">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
      </header>

      <div className="stats-grid">
        <StatCard
          title="Total Monthly Spend"
          value={formatCurrency(stats.total_spend)}
          trend="Current"
          trendUp={true}
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Wasted Spend"
          value={formatCurrency(stats.wasted_spend)}
          trend={stats.wasted_spend > 0 ? "Needs Attention" : "All Good"}
          trendUp={stats.wasted_spend === 0}
          icon={TrendingDown}
          color={stats.wasted_spend > 0 ? "danger" : "success"}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.active_subs}
          trend={`${stats.zombie_count} Zombies`}
          trendUp={stats.zombie_count === 0}
          icon={Activity}
          color="primary"
        />
        <StatCard
          title="Health Score"
          value={`${stats.health_score}/100`}
          trend={stats.health_score === 100 ? "Perfect" : "Could Improve"}
          trendUp={stats.health_score > 80}
          icon={TrendingUp}
          color={stats.health_score > 80 ? "success" : "warning"}
        />
      </div>

      <div className="main-charts">
        <div className="chart-card glass-panel wide">
          <h3>Spend by Team</h3>
          <div className="team-chart-container">
            {stats.spend_by_team?.length > 0 ? (
              stats.spend_by_team.map((item, index) => {
                const max = stats.spend_by_team[0].amount;
                const pct = (item.amount / max) * 100;
                return (
                  <div key={item.team} className="team-bar-row">
                    <span className="team-label">{item.team}</span>
                    <div className="bar-trough">
                      <div className="bar-fill" style={{ width: `${pct}%`, transitionDelay: `${index * 50}ms` }}></div>
                    </div>
                    <span className="team-amount">${item.amount}</span>
                  </div>
                )
              })
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 }}>
                No active spend data yet.
              </div>
            )}
          </div>
        </div>

        <div className="chart-card glass-panel narrow">
          <h3>Waste Distribution</h3>
          {/* Calculate real percentages */}
          {(() => {
            const total = (stats.active_fully_used || 0) + (stats.active_with_waste || 0) + (stats.zombie_count || 0);
            const safeTotal = total === 0 ? 1 : total; // Prevent div by zero

            const zombiePct = Math.round(((stats.zombie_count || 0) / safeTotal) * 100);
            const wastePct = Math.round(((stats.active_with_waste || 0) / safeTotal) * 100);
            const activePct = 100 - zombiePct - wastePct;

            return (
              <>
                <div className="waste-meter">
                  <div className="waste-circle" style={{
                    // Dynamic border colors using CSS conic-gradient would be better, but sticking to simple borders for MVP
                    borderRightColor: wastePct > 0 ? 'var(--accent-secondary)' : 'var(--bg-hover)',
                    borderTopColor: zombiePct > 0 ? 'var(--accent-primary)' : 'var(--bg-hover)'
                  }}>
                    <span>{zombiePct}%</span>
                    <small>Zombie</small>
                  </div>
                </div>
                <div className="waste-legend">
                  <div className="legend-item"><span className="dot zombie"></span>Zombie ({zombiePct}%)</div>
                  <div className="legend-item"><span className="dot unused"></span>Unused Seats ({wastePct}%)</div>
                  <div className="legend-item"><span className="dot active"></span>Fully Active ({activePct}%)</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      <style>{`
        .dashboard-container {
          padding: 32px;
          flex: 1;
          overflow-y: auto;
          margin-left: 260px; /* Sidebar width */
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        .page-title {
          font-size: 32px;
          margin: 0;
          font-weight: 700;
        }
        .page-subtitle {
          color: var(--text-secondary);
          margin: 4px 0 0;
        }
        .date-badge {
          background: var(--bg-card);
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          font-size: 14px;
          color: var(--text-muted);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .main-charts {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        .chart-card {
          padding: 24px;
          min-height: 300px;
        }
        .mock-chart-large {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          height: 200px;
          margin-top: 32px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--glass-border);
        }
        .chart-bar {
          flex: 1;
          background: linear-gradient(to top, var(--bg-hover), var(--accent-primary));
          opacity: 0.6;
          border-radius: 4px 4px 0 0;
          transition: height 0.3s;
        }
        .chart-bar:hover {
          opacity: 1;
        }

        .waste-meter {
          display: flex;
          justify-content: center;
          padding: 32px 0;
        }
        .waste-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 8px solid var(--bg-hover);
          border-top-color: var(--accent-primary);
          border-right-color: var(--accent-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
        }
        .element-legend {
          margin-top: 16px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot.zombie { background: var(--accent-primary); }
        .dot.unused { background: var(--accent-secondary); }
        .dot.active { background: var(--bg-hover); }

        /* Team Chart Styles */
        .team-chart-container {
            margin-top: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .team-bar-row {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
        }
        .team-label {
            width: 100px;
            text-align: right;
            color: var(--text-secondary);
        }
        .bar-trough {
            flex: 1;
            height: 8px;
            background: var(--bg-hover);
            border-radius: 4px;
            overflow: hidden;
        }
        .bar-fill {
            height: 100%;
            background: var(--accent-success);
            border-radius: 4px;
            width: 0;
            transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .team-amount {
            width: 60px;
            font-weight: 600;
            color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon: Icon, color }) {
  const getAccentColor = (c) => {
    switch (c) {
      case 'success': return 'var(--accent-success)';
      case 'danger': return 'var(--accent-primary)';
      case 'warning': return 'var(--accent-secondary)';
      default: return 'var(--accent-purple)';
    }
  };

  return (
    <div className="glass-panel stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div className="icon-box" style={{ background: `rgba(255,255,255,0.05)` }}>
          <Icon size={18} color={getAccentColor(color)} />
        </div>
      </div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        <span className="stat-trend" style={{ color: trendUp ? (color === "danger" ? "var(--accent-primary)" : "var(--accent-success)") : "var(--text-muted)" }}>
          {trend}
        </span>
      </div>
      <style>{`
        .stat-card {
          padding: 20px;
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .stat-title {
          color: var(--text-secondary);
          font-size: 14px;
        }
        .icon-box {
          padding: 8px;
          border-radius: 8px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 600;
          display: block;
        }
        .stat-trend {
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }
      `}</style>
    </div >
  );
}
