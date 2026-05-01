// ============================================================
// App.jsx — Root component: state management & playback engine
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';

import Header      from './components/Header.jsx';
import Sidebar     from './components/Sidebar.jsx';
import ControlsBar from './components/ControlsBar.jsx';
import SortView    from './components/SortView.jsx';
import GraphView   from './components/GraphView.jsx';
import StatsBar    from './components/StatsBar.jsx';

import { SORT_ALGORITHMS }                       from './algorithms/sorting.js';
import { GRAPH_ALGORITHMS, generateDefaultGraph } from './graph/traversals.js';
import { generateArray, speedToDelay }            from './utils/helpers.js';

const DEFAULT_SIZE  = 40;
const DEFAULT_SPEED = 5;

export default function App() {
  // ---- Mode ----
  const [mode, setMode] = useState('sort'); // 'sort' | 'graph'

  // ---- Sort state ----
  const [sortAlgo,  setSortAlgo]  = useState('bubble');
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [rawArray,  setRawArray]  = useState(() => generateArray(DEFAULT_SIZE));
  const [sortSteps, setSortSteps] = useState([]);
  const [stepIdx,   setStepIdx]   = useState(0);

  // ---- Graph state ----
  const [graphAlgo,  setGraphAlgo]  = useState('bfs');
  const [graphData]                 = useState(() => generateDefaultGraph());
  const [startNode,  setStartNode]  = useState('A');
  const [endNode,    setEndNode]    = useState('J');
  const [graphSteps, setGraphSteps] = useState([]);
  const [graphIdx,   setGraphIdx]   = useState(0);

  // ---- Shared playback ----
  const [playing,    setPlaying]    = useState(false);
  const [speed,      setSpeed]      = useState(DEFAULT_SPEED);
  const [logEntries, setLogEntries] = useState([]);

  const timerRef = useRef(null);

  // ============================================================
  // Derived values
  // ============================================================
  const isSortMode  = mode === 'sort';
  const steps       = isSortMode ? sortSteps  : graphSteps;
  const idx         = isSortMode ? stepIdx    : graphIdx;
  const setIdx      = isSortMode ? setStepIdx : setGraphIdx;
  const currentStep = steps[idx] ?? null;
  const canStep     = idx < steps.length - 1;

  const sortMeta  = SORT_ALGORITHMS[sortAlgo];
  const graphMeta = GRAPH_ALGORITHMS[graphAlgo];

  // ============================================================
  // Build steps when algo / data changes
  // ============================================================
  useEffect(() => {
    if (!isSortMode) return;
    const meta = SORT_ALGORITHMS[sortAlgo];
    if (!meta) return;
    setSortSteps(meta.fn(rawArray));
    setStepIdx(0);
    setPlaying(false);
    setLogEntries([]);
    clearTimer();
  }, [sortAlgo, rawArray]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isSortMode) return;
    const meta = GRAPH_ALGORITHMS[graphAlgo];
    if (!meta) return;
    setGraphSteps(meta.fn(graphData.nodes, graphData.edges, startNode, endNode));
    setGraphIdx(0);
    setPlaying(false);
    setLogEntries([]);
    clearTimer();
  }, [graphAlgo, startNode, endNode, isSortMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================================
  // Playback engine
  // ============================================================
  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const advance = useCallback(() => {
    setIdx(prev => {
      if (prev >= steps.length - 1) {
        setPlaying(false);
        clearTimer();
        return prev;
      }
      const next = prev + 1;
      const s = steps[next];
      if (s?.log) {
        setLogEntries(l => [
          ...l.slice(-60),
          { text: s.log, type: s.logType ?? 'info' },
        ]);
      }
      return next;
    });
  }, [steps, setIdx]);

  useEffect(() => {
    if (playing) {
      clearTimer();
      timerRef.current = setInterval(advance, speedToDelay(speed));
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [playing, speed, advance]);

  // Stop when we reach the last step
  useEffect(() => {
    if (idx >= steps.length - 1 && playing) setPlaying(false);
  }, [idx, steps.length, playing]);

  // ============================================================
  // Event handlers
  // ============================================================
  function handlePlay() {
    if (idx >= steps.length - 1) return;
    setPlaying(p => !p);
  }

  function handleStep() {
    if (!canStep || playing) return;
    const next = idx + 1;
    const s = steps[next];
    if (s?.log) {
      setLogEntries(l => [...l.slice(-60), { text: s.log, type: s.logType ?? 'info' }]);
    }
    setIdx(next);
  }

  function handleReset() {
    setPlaying(false);
    clearTimer();
    setIdx(0);
    setLogEntries([]);
  }

  function handleNewArray() {
    setRawArray(generateArray(arraySize));
  }

  function handleSizeChange(size) {
    setArraySize(size);
    setRawArray(generateArray(size));
  }

  function handleModeChange(m) {
    setMode(m);
    setPlaying(false);
    clearTimer();
    setLogEntries([]);
    setStepIdx(0);
    setGraphIdx(0);
  }

  function handleAlgoChange(key) {
    setPlaying(false);
    clearTimer();
    setLogEntries([]);
    setStepIdx(0);
    setGraphIdx(0);
    if (isSortMode) setSortAlgo(key);
    else setGraphAlgo(key);
  }

  // ============================================================
  // Stats
  // ============================================================
  const comparisons = currentStep?.comparisons ?? 0;
  const swaps       = currentStep?.swaps       ?? 0;
  const status =
    playing             ? 'Running'
    : idx === 0         ? 'Ready'
    : idx >= steps.length - 1 ? 'Done'
    : 'Paused';

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="app-shell">
      <Header mode={mode} onModeChange={handleModeChange} />

      <div className="main-layout">
        <Sidebar
          mode={mode}
          currentAlgo={isSortMode ? sortAlgo : graphAlgo}
          onAlgoChange={handleAlgoChange}
        />

        <div className="content-panel">
          <ControlsBar
            mode={mode}
            playing={playing}
            canStep={canStep}
            speed={speed}
            arraySize={arraySize}
            graphNodes={graphData.nodes}
            startNode={startNode}
            endNode={endNode}
            onPlay={handlePlay}
            onStep={handleStep}
            onReset={handleReset}
            onSpeedChange={setSpeed}
            onSizeChange={handleSizeChange}
            onStartNodeChange={n => { setStartNode(n); handleReset(); }}
            onEndNodeChange={n => { setEndNode(n); handleReset(); }}
            onNewArray={handleNewArray}
          />

          <div className="viz-area">
            {isSortMode ? (
              <SortView
                step={currentStep ?? sortSteps[0]}
                algoMeta={sortMeta}
                logEntries={logEntries}
              />
            ) : (
              <GraphView
                nodes={graphData.nodes}
                edges={graphData.edges}
                step={currentStep}
                algoMeta={graphMeta}
                startNode={startNode}
                endNode={endNode}
                logEntries={logEntries}
              />
            )}
          </div>

          <StatsBar
            comparisons={comparisons}
            swaps={swaps}
            stepIdx={idx}
            totalSteps={steps.length}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}
