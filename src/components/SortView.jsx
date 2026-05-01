// ============================================================
// components/SortView.jsx — Sorting visualization panel
// ============================================================

import { useRef, useEffect } from 'react';

export default function SortView({ step, algoMeta, logEntries }) {
  const logRef = useRef(null);

  // Auto-scroll log to bottom on new entries
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logEntries]);

  if (!step || !algoMeta) return null;

  const { arr, comparing, swapping, sorted, pivot } = step;
  const sortedSet   = new Set(sorted);
  const compareSet  = new Set(comparing);
  const swappingSet = new Set(swapping);
  const maxVal      = Math.max(...arr, 1);

  function getBarClass(i) {
    if (sortedSet.has(i))   return 'sort-bar--sorted';
    if (swappingSet.has(i)) return 'sort-bar--swap';
    if (i === pivot)        return 'sort-bar--pivot';
    if (compareSet.has(i))  return 'sort-bar--compare';
    return '';
  }

  function getCellClass(i) {
    if (sortedSet.has(i))   return 'arr-cell--sorted';
    if (swappingSet.has(i)) return 'arr-cell--swap';
    if (i === pivot)        return 'arr-cell--pivot';
    if (compareSet.has(i))  return 'arr-cell--compare';
    return '';
  }

  const showCells = arr.length <= 30;

  return (
    <>
      {/* Bar chart visualization */}
      <div className="sort-canvas">
        {arr.map((val, i) => (
          <div
            key={i}
            className={`sort-bar ${getBarClass(i)}`}
            style={{ height: `${(val / maxVal) * 100}%` }}
            title={`[${i}] = ${val}`}
          />
        ))}
      </div>

      {/* Array cells — shown only for small arrays */}
      {showCells && (
        <div className="array-row">
          {arr.map((val, i) => (
            <div key={i} className={`arr-cell ${getCellClass(i)}`}>
              {val}
            </div>
          ))}
        </div>
      )}

      {/* Info & pseudocode grid */}
      <div className="info-grid">
        {/* Left: algorithm info + step log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="info-panel">
            <div className="info-panel__title">{algoMeta.name}</div>
            <div className="info-panel__desc">{algoMeta.desc}</div>
            <div className="complexity-grid">
              <div className="complexity-item">
                <span className="complexity-item__label">Best</span>
                <span className="complexity-item__val">{algoMeta.complexity.best}</span>
              </div>
              <div className="complexity-item">
                <span className="complexity-item__label">Average</span>
                <span className="complexity-item__val">{algoMeta.complexity.avg}</span>
              </div>
              <div className="complexity-item">
                <span className="complexity-item__label">Worst</span>
                <span className="complexity-item__val">{algoMeta.complexity.worst}</span>
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
                  : entry.type === 'swap'   ? 'log-entry--swap'
                  : entry.type === 'done'   ? 'log-entry--done'
                  : ''
                }`}
              >
                {entry.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right: pseudocode */}
        <div className="pseudo-panel">
          <div className="pseudo-panel__title">Pseudocode</div>
          {algoMeta.pseudo.map((line, i) => (
            <div
              key={i}
              className={`pseudo-line ${step.pseudoLine === i ? 'pseudo-line--active' : ''}`}
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
