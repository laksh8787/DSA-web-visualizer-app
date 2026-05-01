// ============================================================
// components/Header.jsx — App header with mode tab switcher
// ============================================================

export default function Header({ mode, onModeChange }) {
  return (
    <header className="header">
      <div className="header-logo">
        DSA<em>.</em>viz
      </div>

      <div className="header-tabs">
        <button
          className={`tab-btn ${mode === 'sort' ? 'tab-btn--active' : ''}`}
          onClick={() => onModeChange('sort')}
        >
          Sorting
        </button>
        <button
          className={`tab-btn ${mode === 'graph' ? 'tab-btn--active' : ''}`}
          onClick={() => onModeChange('graph')}
        >
          Graph
        </button>
      </div>

      <div className="header-badge">13 algos · 4 traversals</div>
    </header>
  );
}
