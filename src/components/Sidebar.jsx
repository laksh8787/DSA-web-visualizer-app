// ============================================================
// components/Sidebar.jsx — Algorithm selector sidebar
// ============================================================

import { SORT_ALGORITHMS } from '../algorithms/sorting.js';
import { GRAPH_ALGORITHMS } from '../graph/traversals.js';

const SORT_GROUPS = [
  { label: 'Basic',          keys: ['bubble', 'selection', 'insertion', 'gnome'] },
  { label: 'Efficient',      keys: ['merge', 'quick', 'heap', 'shell', 'tim', 'comb', 'cocktail'] },
  { label: 'Non-Comparison', keys: ['counting', 'radix'] },
];

const GRAPH_GROUPS = [
  { label: 'Unweighted',              keys: ['bfs', 'dfs'] },
  { label: 'Weighted / Shortest Path', keys: ['dijkstra', 'astar'] },
];

const BADGE_CLASS = {
  'n²':    'badge-n2',
  'nlogn': 'badge-nlogn',
  'n':     'badge-n',
};

export default function Sidebar({ mode, currentAlgo, onAlgoChange }) {
  const groups  = mode === 'sort' ? SORT_GROUPS  : GRAPH_GROUPS;
  const algoMap = mode === 'sort' ? SORT_ALGORITHMS : GRAPH_ALGORITHMS;

  return (
    <aside className="sidebar">
      {groups.map((group, gi) => (
        <div key={gi} className="sidebar-section">
          <div className="sidebar-section-label">{group.label}</div>

          {group.keys.map(key => {
            const algo = algoMap[key];
            if (!algo) return null;
            return (
              <button
                key={key}
                className={`algo-item ${currentAlgo === key ? 'algo-item--active' : ''}`}
                onClick={() => onAlgoChange(key)}
              >
                <span>{algo.name}</span>
                <span className={`algo-badge ${BADGE_CLASS[algo.badge] || ''}`}>
                  {algo.badge}
                </span>
              </button>
            );
          })}

          {gi < groups.length - 1 && <div className="sidebar-divider" />}
        </div>
      ))}
    </aside>
  );
}
