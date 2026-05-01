// ============================================================
// components/StatsBar.jsx — Bottom statistics bar
// ============================================================

export default function StatsBar({ comparisons, swaps, stepIdx, totalSteps, status }) {
  const statusStyle =
    status === 'Running' ? { color: 'var(--accent)' }
    : status === 'Done'  ? { color: 'var(--accent3)' }
    : {};

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-item__label">Comparisons</span>
        <span className="stat-item__value">{comparisons.toLocaleString()}</span>
      </div>

      <div className="stat-item">
        <span className="stat-item__label">Swaps / Moves</span>
        <span className="stat-item__value">{swaps.toLocaleString()}</span>
      </div>

      <div className="stat-item">
        <span className="stat-item__label">Step</span>
        <span className="stat-item__value">
          {stepIdx}{' '}
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            / {totalSteps}
          </span>
        </span>
      </div>

      <div className="stat-item">
        <span className="stat-item__label">Status</span>
        <span
          className={`stat-item__value ${
            status === 'Ready' || status === 'Done' ? 'stat-item__value--dim' : ''
          }`}
          style={statusStyle}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
