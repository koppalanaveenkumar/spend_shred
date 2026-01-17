import React from 'react';

export function TableSkeleton() {
    return (
        <div className="skeleton-container animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton-row">
                    <div className="skeleton-cell wide"></div>
                    <div className="skeleton-cell"></div>
                    <div className="skeleton-cell"></div>
                    <div className="skeleton-cell wide"></div>
                    <div className="skeleton-cell"></div>
                </div>
            ))}
            <style>{`
        .skeleton-container {
            width: 100%;
        }
        .skeleton-row {
            display: flex;
            gap: 24px;
            padding: 16px 24px;
            border-bottom: 1px solid var(--glass-border);
            align-items: center;
        }
        .skeleton-cell {
            height: 20px;
            background: var(--bg-hover);
            border-radius: 4px;
            flex: 1;
        }
        .skeleton-cell.wide {
            flex: 2;
        }
        
        .animate-pulse .skeleton-cell {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
      `}</style>
        </div>
    );
}
