// ============================================================
// components/ControlsBar.jsx — Playback & configuration controls
// ============================================================

export default function ControlsBar({
  mode,
  playing,
  canStep,
  speed,
  arraySize,
  graphNodes,
  startNode,
  endNode,
  onPlay,
  onStep,
  onReset,
  onSpeedChange,
  onSizeChange,
  onStartNodeChange,
  onEndNodeChange,
  onNewArray,
}) {
  return (
    <div className="controls-bar">
      {/* Playback buttons */}
      <div className="ctrl-group">
        <button
          className="btn btn--primary"
          onClick={onPlay}
          disabled={!canStep && !playing}
        >
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="btn" onClick={onStep} disabled={!canStep || playing}>
          Step →
        </button>
        <button className="btn btn--danger" onClick={onReset}>
          ↺ Reset
        </button>
      </div>

      {/* Speed slider */}
      <div className="ctrl-group">
        <span className="ctrl-label">Speed</span>
        <div className="slider-track">
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={e => onSpeedChange(Number(e.target.value))}
          />
          <div className="speed-badge">{speed}×</div>
        </div>
      </div>

      {/* Array size — sort mode only */}
      {mode === 'sort' && (
        <div className="ctrl-group">
          <span className="ctrl-label">Size</span>
          <div className="slider-track">
            <input
              type="range"
              min="10"
              max="80"
              value={arraySize}
              onChange={e => onSizeChange(Number(e.target.value))}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', minWidth: '24px' }}>
              {arraySize}
            </span>
          </div>
        </div>
      )}

      {/* Graph node selectors — graph mode only */}
      {mode === 'graph' && (
        <>
          <div className="ctrl-group">
            <span className="ctrl-label">Start</span>
            <select value={startNode} onChange={e => onStartNodeChange(e.target.value)}>
              {graphNodes.map(n => (
                <option key={n.id} value={n.id}>{n.id}</option>
              ))}
            </select>
          </div>
          <div className="ctrl-group">
            <span className="ctrl-label">End</span>
            <select value={endNode} onChange={e => onEndNodeChange(e.target.value)}>
              {graphNodes.map(n => (
                <option key={n.id} value={n.id}>{n.id}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* New array button — sort mode only */}
      {mode === 'sort' && (
        <div className="ctrl-group" style={{ marginLeft: 'auto' }}>
          <button className="btn" onClick={onNewArray}>⟳ New Array</button>
        </div>
      )}
    </div>
  );
}
