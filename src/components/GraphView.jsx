// ============================================================
// components/GraphView.jsx — Graph visualization panel (SVG)
// ============================================================

import { useRef, useEffect } from 'react';

export default function GraphView({
  nodes,
  edges,
  step,
  algoMeta,
  startNode,
  endNode,
  logEntries,
}) {
  const logRef = useRef(null);

  // Auto-scroll log to bottom on new entries
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logEntries]);

  if (!algoMeta) return null;

  const visitedNodes = step?.visitedNodes ?? new Set();
  const currentNode  = step?.currentNode  ?? null;
  const visitedEdges = step?.visitedEdges ?? new Set();
  const pathNodes    = step?.pathNodes    ?? new Set();
  const pathEdges    = step?.pathEdges    ?? new Set();

  function nodeClass(id) {
    if (pathNodes.has(id))    return 'graph-node-circle--path';
    if (id === currentNode)   return 'graph-node-circle--current';
    if (visitedNodes.has(id)) return 'graph-node-circle--visited';
    if (id === startNode)     return 'graph-node-circle--start';
    if (id === endNode)       return 'graph-node-circle--end';
    return '';
  }

  function edgeClass(e) {
    const key1 = `${e.from}-${e.to}`;
    const key2 = `${e.to}-${e.from}`;
    if (pathEdges.has(key1) || pathEdges.has(key2))       return 'graph-edge--path';
    if (visitedEdges.has(key1) || visitedEdges.has(key2)) return 'graph-edge--visited';
    return '';
  }

  function getNode(id) {
    return nodes.find(n => n.id === id);
  }

  return (
    <>
      {/* SVG graph canvas */}
      <div className="graph-canvas">
        <svg id="graph-svg" viewBox="0 0 660 360" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="var(--border)" />
            </marker>
          </defs>

          {/* Render edges */}
          {edges.map((e, i) => {
            const from = getNode(e.from);
            const to   = getNode(e.to);
            if (!from || !to) return null;
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;
            return (
              <g key={i}>
                <line
                  x1={from.x} y1={from.y}
                  x2={to.x}   y2={to.y}
                  className={`graph-edge ${edgeClass(e)}`}
                />
                <text x={mx} y={my - 6} className="graph-edge-weight">
                  {e.weight}
                </text>
              </g>
            );
          })}

          {/* Render nodes */}
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={18}
                className={`graph-node-circle ${nodeClass(node.id)}`}
              />
              <text x={node.x} y={node.y} className="graph-node-label">
                {node.id}
              </text>

              {node.id === startNode && (
                <text
                  x={node.x}
                  y={node.y - 26}
                  style={{
                    fill: 'var(--accent)',
                    fontSize: '9px',
                    textAnchor: 'middle',
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  START
                </text>
              )}
              {node.id === endNode && (
                <text
                  x={node.x}
                  y={node.y - 26}
                  style={{
                    fill: 'var(--accent2)',
                    fontSize: '9px',
                    textAnchor: 'middle',
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  END
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Info & pseudocode grid */}
      <div className="info-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="info-panel">
            <div className="info-panel__title">{algoMeta.name}</div>
            <div className="info-panel__desc">{algoMeta.desc}</div>
            <div className="complexity-grid">
              <div className="complexity-item">
                <span className="complexity-item__label">Time</span>
                <span className="complexity-item__val">{algoMeta.complexity.time}</span>
              </div>
              <div className="complexity-item">
                <span className="complexity-item__label">Space</span>
                <span className="complexity-item__val">{algoMeta.complexity.space}</span>
              </div>
            </div>
          </div>

          <div className="step-log" ref={logRef}>
            {logEntries.length === 0 && (
              <div className="log-entry">Press Play or Step to start...</div>
            )}
            {logEntries.map((entry, i) => (
              <div
                key={i}
                className={`log-entry ${
                  entry.type === 'highlight' ? 'log-entry--highlight'
                  : entry.type === 'done'   ? 'log-entry--done'
                  : ''
                }`}
              >
                {entry.text}
              </div>
            ))}
          </div>
        </div>

        <div className="pseudo-panel">
          <div className="pseudo-panel__title">Pseudocode</div>
          {algoMeta.pseudo.map((line, i) => (
            <div
              key={i}
              className={`pseudo-line ${step?.pseudoLine === i ? 'pseudo-line--active' : ''}`}
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
