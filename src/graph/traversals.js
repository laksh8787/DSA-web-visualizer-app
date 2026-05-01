// ============================================================
// graph/traversals.js — BFS, DFS, Dijkstra, A* step generators
// Step shape: { visitedNodes, currentNode, visitedEdges, pathNodes, pathEdges, queue, log, pseudoLine }
// ============================================================

function makeStep(opts = {}) {
  return {
    visitedNodes: opts.visitedNodes ?? new Set(),
    currentNode:  opts.currentNode  ?? null,
    visitedEdges: opts.visitedEdges ?? new Set(),
    pathNodes:    opts.pathNodes    ?? new Set(),
    pathEdges:    opts.pathEdges    ?? new Set(),
    queue:        opts.queue        ?? [],
    log:          opts.log          ?? '',
    logType:      opts.logType      ?? 'info',
    pseudoLine:   opts.pseudoLine   ?? -1,
    distances:    opts.distances    ?? {},
  };
}

function cloneSet(s) { return new Set(s); }

// ---- BFS ----
export function bfs(nodes, edges, startId, endId) {
  const steps = [];
  const adj = buildAdj(nodes, edges);
  const visited = new Set();
  const parent = {};
  const queue = [startId];
  visited.add(startId);
  const visitedEdges = new Set();

  steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: startId, queue: [...queue], pseudoLine: 0, log: `BFS start at node ${startId}` }));

  while (queue.length > 0) {
    const node = queue.shift();

    steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: node, visitedEdges: cloneSet(visitedEdges), queue: [...queue], pseudoLine: 1, log: `Dequeue node ${node}` }));

    if (node === endId) {
      const { pathNodes, pathEdges } = reconstructPath(parent, startId, endId, edges);
      steps.push(makeStep({ visitedNodes: cloneSet(visited), visitedEdges: cloneSet(visitedEdges), pathNodes, pathEdges, pseudoLine: -1, log: `🎯 Found ${endId}! Path length = ${pathNodes.size - 1}`, logType: 'done' }));
      return steps;
    }

    for (const { to, edgeKey } of (adj[node] || [])) {
      if (!visited.has(to)) {
        visited.add(to);
        parent[to] = node;
        visitedEdges.add(edgeKey);
        queue.push(to);
        steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: to, visitedEdges: cloneSet(visitedEdges), queue: [...queue], pseudoLine: 3, log: `Enqueue ${to} (neighbor of ${node})`, logType: 'highlight' }));
      }
    }
  }

  steps.push(makeStep({ visitedNodes: cloneSet(visited), visitedEdges: cloneSet(visitedEdges), pseudoLine: -1, log: `No path found from ${startId} to ${endId}`, logType: 'done' }));
  return steps;
}

// ---- DFS ----
export function dfs(nodes, edges, startId, endId) {
  const steps = [];
  const adj = buildAdj(nodes, edges);
  const visited = new Set();
  const parent = {};
  const visitedEdges = new Set();
  let found = false;

  function dfsHelper(node) {
    if (found) return;
    visited.add(node);
    steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: node, visitedEdges: cloneSet(visitedEdges), pseudoLine: 1, log: `Visit node ${node}` }));

    if (node === endId) {
      found = true;
      const { pathNodes, pathEdges } = reconstructPath(parent, startId, endId, edges);
      steps.push(makeStep({ visitedNodes: cloneSet(visited), visitedEdges: cloneSet(visitedEdges), pathNodes, pathEdges, pseudoLine: -1, log: `🎯 Found ${endId}!`, logType: 'done' }));
      return;
    }

    for (const { to, edgeKey } of (adj[node] || [])) {
      if (!visited.has(to)) {
        parent[to] = node;
        visitedEdges.add(edgeKey);
        steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: to, visitedEdges: cloneSet(visitedEdges), pseudoLine: 3, log: `Explore edge ${node} → ${to}`, logType: 'highlight' }));
        dfsHelper(to);
        if (found) return;
      }
    }
  }

  steps.push(makeStep({ pseudoLine: 0, log: `DFS start at ${startId}` }));
  dfsHelper(startId);

  if (!found) {
    steps.push(makeStep({ visitedNodes: cloneSet(visited), visitedEdges: cloneSet(visitedEdges), pseudoLine: -1, log: `No path found`, logType: 'done' }));
  }

  return steps;
}

// ---- Dijkstra ----
export function dijkstra(nodes, edges, startId, endId) {
  const steps = [];
  const adj = buildAdj(nodes, edges, true);
  const dist = {};
  const parent = {};
  const visited = new Set();
  const visitedEdges = new Set();

  nodes.forEach(n => dist[n.id] = Infinity);
  dist[startId] = 0;

  const pq = [{ id: startId, d: 0 }];

  steps.push(makeStep({ visitedNodes: cloneSet(visited), pseudoLine: 0, log: `Dijkstra start at ${startId}. dist[${startId}]=0`, distances: { ...dist } }));

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d);
    const { id: node, d } = pq.shift();

    if (visited.has(node)) continue;
    visited.add(node);

    steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: node, visitedEdges: cloneSet(visitedEdges), pseudoLine: 2, log: `Process node ${node} (dist=${d === Infinity ? '∞' : d})`, distances: { ...dist } }));

    if (node === endId) {
      const { pathNodes, pathEdges } = reconstructPath(parent, startId, endId, edges);
      steps.push(makeStep({ visitedNodes: cloneSet(visited), visitedEdges: cloneSet(visitedEdges), pathNodes, pathEdges, pseudoLine: -1, log: `🎯 Shortest path to ${endId}: ${dist[endId]}`, logType: 'done', distances: { ...dist } }));
      return steps;
    }

    for (const { to, weight, edgeKey } of (adj[node] || [])) {
      const newDist = dist[node] + weight;
      steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: to, visitedEdges: cloneSet(visitedEdges), pseudoLine: 4, log: `Edge ${node}→${to}: dist=${newDist} (current=${dist[to] === Infinity ? '∞' : dist[to]})`, distances: { ...dist } }));
      if (newDist < dist[to]) {
        dist[to] = newDist;
        parent[to] = node;
        visitedEdges.add(edgeKey);
        pq.push({ id: to, d: newDist });
        steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: to, visitedEdges: cloneSet(visitedEdges), pseudoLine: 5, log: `Update dist[${to}] = ${newDist}`, logType: 'highlight', distances: { ...dist } }));
      }
    }
  }

  steps.push(makeStep({ visitedNodes: cloneSet(visited), visitedEdges: cloneSet(visitedEdges), pseudoLine: -1, log: `No path found`, logType: 'done', distances: { ...dist } }));
  return steps;
}

// ---- A* ----
export function aStar(nodes, edges, startId, endId) {
  const steps = [];
  const adj = buildAdj(nodes, edges, true);
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

  function heuristic(a, b) {
    const na = nodeMap[a], nb = nodeMap[b];
    if (!na || !nb) return 0;
    return Math.sqrt((na.x - nb.x) ** 2 + (na.y - nb.y) ** 2) / 50;
  }

  const gScore = {};
  const fScore = {};
  const parent = {};
  const visited = new Set();
  const visitedEdges = new Set();

  nodes.forEach(n => { gScore[n.id] = Infinity; fScore[n.id] = Infinity; });
  gScore[startId] = 0;
  fScore[startId] = heuristic(startId, endId);

  const open = new Set([startId]);

  steps.push(makeStep({ pseudoLine: 0, log: `A* start: heuristic(${startId},${endId})=${heuristic(startId,endId).toFixed(1)}` }));

  while (open.size > 0) {
    let current = [...open].reduce((a, b) => fScore[a] < fScore[b] ? a : b);
    visited.add(current);

    steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: current, visitedEdges: cloneSet(visitedEdges), pseudoLine: 2, log: `Process ${current} (f=${fScore[current].toFixed(1)}, g=${gScore[current].toFixed(1)})` }));

    if (current === endId) {
      const { pathNodes, pathEdges } = reconstructPath(parent, startId, endId, edges);
      steps.push(makeStep({ visitedNodes: cloneSet(visited), visitedEdges: cloneSet(visitedEdges), pathNodes, pathEdges, pseudoLine: -1, log: `🎯 A* found path! Cost=${gScore[endId].toFixed(1)}`, logType: 'done' }));
      return steps;
    }

    open.delete(current);

    for (const { to, weight, edgeKey } of (adj[current] || [])) {
      const tentative = gScore[current] + weight;
      steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: to, visitedEdges: cloneSet(visitedEdges), pseudoLine: 4, log: `Check neighbor ${to}: tentative g=${tentative.toFixed(1)}` }));
      if (tentative < gScore[to]) {
        parent[to] = current;
        gScore[to] = tentative;
        fScore[to] = tentative + heuristic(to, endId);
        visitedEdges.add(edgeKey);
        open.add(to);
        steps.push(makeStep({ visitedNodes: cloneSet(visited), currentNode: to, visitedEdges: cloneSet(visitedEdges), pseudoLine: 5, log: `Update ${to}: g=${tentative.toFixed(1)}, f=${fScore[to].toFixed(1)}, h=${heuristic(to,endId).toFixed(1)}`, logType: 'highlight' }));
      }
    }
  }

  steps.push(makeStep({ visitedNodes: cloneSet(visited), visitedEdges: cloneSet(visitedEdges), pseudoLine: -1, log: 'No path found', logType: 'done' }));
  return steps;
}

// ---- Helpers ----
function buildAdj(nodes, edges, weighted = false) {
  const adj = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    const edgeKey = `${e.from}-${e.to}`;
    const w = weighted ? (e.weight || 1) : 1;
    adj[e.from].push({ to: e.to, weight: w, edgeKey });
    adj[e.to].push({ to: e.from, weight: w, edgeKey }); // undirected
  });
  return adj;
}

function reconstructPath(parent, startId, endId, edges) {
  const pathNodes = new Set();
  const pathEdges = new Set();
  let cur = endId;
  while (cur !== undefined) {
    pathNodes.add(cur);
    const prev = parent[cur];
    if (prev !== undefined) {
      const edgeKey = edges.find(e =>
        (e.from === prev && e.to === cur) || (e.from === cur && e.to === prev)
      );
      if (edgeKey) pathEdges.add(`${edgeKey.from}-${edgeKey.to}`);
    }
    cur = parent[cur];
  }
  return { pathNodes, pathEdges };
}

// ---- Graph algorithm metadata ----
export const GRAPH_ALGORITHMS = {
  bfs: {
    name: 'Breadth-First Search',
    badge: 'n',
    complexity: { time: 'O(V+E)', space: 'O(V)' },
    desc: 'Explores all neighbors at the present depth before moving deeper. Guarantees the shortest path in unweighted graphs.',
    pseudo: [
      '<span class="fn">BFS</span>(graph, start):',
      '  queue = [start]; visited = {start}',
      '  <span class="kw">while</span> queue not empty:',
      '    node = queue.<span class="fn">dequeue</span>()',
      '    <span class="kw">if</span> node == end: <span class="kw">return</span> path',
      '    <span class="kw">for</span> neighbor <span class="kw">in</span> graph[node]:',
      '      <span class="kw">if</span> neighbor not visited:',
      '        queue.<span class="fn">enqueue</span>(neighbor)',
    ],
    fn: bfs,
  },
  dfs: {
    name: 'Depth-First Search',
    badge: 'n',
    complexity: { time: 'O(V+E)', space: 'O(V)' },
    desc: 'Explores as far as possible along each branch before backtracking. Uses a stack (or recursion) to track the path.',
    pseudo: [
      '<span class="fn">DFS</span>(graph, node, visited):',
      '  visited.<span class="fn">add</span>(node)',
      '  <span class="kw">if</span> node == end: <span class="kw">return</span> true',
      '  <span class="kw">for</span> neighbor <span class="kw">in</span> graph[node]:',
      '    <span class="kw">if</span> neighbor not visited:',
      '      <span class="fn">DFS</span>(graph, neighbor, visited)',
    ],
    fn: dfs,
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    badge: 'nlogn',
    complexity: { time: 'O((V+E) log V)', space: 'O(V)' },
    desc: 'Finds shortest paths from source to all nodes in a weighted graph. Uses a priority queue to greedily select the closest unvisited node.',
    pseudo: [
      'dist[start] = 0; dist[all] = ∞',
      'pq = [(0, start)]',
      '<span class="kw">while</span> pq not empty:',
      '  (d, node) = pq.<span class="fn">pop_min</span>()',
      '  <span class="kw">for</span> (neighbor, w) <span class="kw">in</span> graph[node]:',
      '    <span class="kw">if</span> dist[node]+w < dist[neighbor]:',
      '      dist[neighbor] = dist[node]+w',
      '      pq.<span class="fn">push</span>((dist[neighbor], neighbor))',
    ],
    fn: dijkstra,
  },
  astar: {
    name: 'A* Search',
    badge: 'nlogn',
    complexity: { time: 'O(E log V)', space: 'O(V)' },
    desc: 'Informed search using a heuristic to guide exploration toward the goal. Finds the optimal path faster than Dijkstra when a good heuristic exists.',
    pseudo: [
      'g[start]=0; f[start]=h(start)',
      'open = {start}',
      '<span class="kw">while</span> open not empty:',
      '  current = node with min f in open',
      '  <span class="kw">if</span> current == end: <span class="kw">return</span> path',
      '  <span class="kw">for</span> neighbor <span class="kw">in</span> graph[current]:',
      '    tentative_g = g[current] + cost',
      '    <span class="kw">if</span> tentative_g < g[neighbor]: update',
    ],
    fn: aStar,
  },
};

// ---- Default graph data ----
export function generateDefaultGraph() {
  const nodes = [
    { id: 'A', x: 120, y: 80  },
    { id: 'B', x: 280, y: 60  },
    { id: 'C', x: 420, y: 120 },
    { id: 'D', x: 180, y: 200 },
    { id: 'E', x: 340, y: 210 },
    { id: 'F', x: 500, y: 190 },
    { id: 'G', x: 100, y: 320 },
    { id: 'H', x: 260, y: 310 },
    { id: 'I', x: 420, y: 300 },
    { id: 'J', x: 560, y: 290 },
  ];

  const edges = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'D', weight: 2 },
    { from: 'B', to: 'C', weight: 3 },
    { from: 'B', to: 'E', weight: 5 },
    { from: 'C', to: 'F', weight: 2 },
    { from: 'D', to: 'G', weight: 4 },
    { from: 'D', to: 'E', weight: 3 },
    { from: 'E', to: 'H', weight: 2 },
    { from: 'E', to: 'I', weight: 4 },
    { from: 'F', to: 'J', weight: 3 },
    { from: 'G', to: 'H', weight: 5 },
    { from: 'H', to: 'I', weight: 2 },
    { from: 'I', to: 'J', weight: 3 },
    { from: 'C', to: 'E', weight: 6 },
  ];

  return { nodes, edges };
}
