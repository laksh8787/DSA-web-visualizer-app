# DSA.viz — Data Structures & Algorithms Visualizer

An interactive web app to visualize **13 sorting algorithms** and **4 graph traversals** with step-by-step animation, pseudocode highlighting, and real-time statistics.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![CSS3](https://img.shields.io/badge/CSS3-Custom_Tokens-1572B6?style=flat&logo=css3)

---

## Features

- **13 Sorting Algorithms** — Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Tim, Comb, Cocktail Shaker, Counting, Radix, Gnome
- **4 Graph Traversals** — BFS, DFS, Dijkstra's, A*
- Step-by-step playback with Play / Pause / Step / Reset controls
- Adjustable speed (1× to 10×) and array size (10 to 80 elements)
- Live pseudocode highlighting synchronized with each step
- Real-time stats: comparisons, swaps, step counter, status
- Step log with color-coded entries
- Configurable start/end nodes for graph traversals

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| UI         | React 18                |
| Bundler    | Vite 5                  |
| Styling    | Pure CSS with variables |
| Fonts      | JetBrains Mono, Syne    |
| Deployment | Vercel / Netlify ready  |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

Verify your install:
```bash
node -v
npm -v
```

### Installation

```bash
# 1. Clone or unzip the project
cd dsa-visualizer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Project Structure

```
dsa-visualizer/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # Entry point — imports styles & renders App
    ├── App.jsx                   # Root component: all state + playback engine
    │
    ├── algorithms/
    │   └── sorting.js            # All 13 sort algorithms + metadata
    │
    ├── graph/
    │   └── traversals.js         # BFS, DFS, Dijkstra, A* + default graph data
    │
    ├── utils/
    │   └── helpers.js            # generateArray, speedToDelay, clamp, etc.
    │
    ├── components/
    │   ├── Header.jsx            # Logo + Sorting / Graph tab switcher
    │   ├── Sidebar.jsx           # Algorithm selector grouped by category
    │   ├── ControlsBar.jsx       # Play / Pause / Step / Reset + sliders
    │   ├── SortView.jsx          # Bar chart + array cells + info panel
    │   ├── GraphView.jsx         # SVG graph canvas + info panel
    │   └── StatsBar.jsx          # Comparisons / swaps / step / status
    │
    └── styles/
        ├── global.css            # CSS variables (design tokens) + resets
        └── components.css        # All component styles
```

---

## Available Scripts

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start dev server at localhost:5173       |
| `npm run build`   | Build for production → `dist/` folder   |
| `npm run preview` | Preview the production build locally     |

---

## Deployment

### Vercel (recommended)

```bash
npm run build
# drag & drop the dist/ folder at vercel.com/new
```

Or connect your GitHub repo to Vercel for automatic deploys on every push.

### Netlify

```bash
npm run build
# drag & drop dist/ at app.netlify.com/drop
```

### GitHub Pages

```bash
npm run build
# push the dist/ folder contents to your gh-pages branch
```

---

## Algorithms Reference

### Sorting

| Algorithm       | Best       | Average    | Worst      | Space    |
|-----------------|------------|------------|------------|----------|
| Bubble Sort     | O(n)       | O(n²)      | O(n²)      | O(1)     |
| Selection Sort  | O(n²)      | O(n²)      | O(n²)      | O(1)     |
| Insertion Sort  | O(n)       | O(n²)      | O(n²)      | O(1)     |
| Merge Sort      | O(n log n) | O(n log n) | O(n log n) | O(n)     |
| Quick Sort      | O(n log n) | O(n log n) | O(n²)      | O(log n) |
| Heap Sort       | O(n log n) | O(n log n) | O(n log n) | O(1)     |
| Shell Sort      | O(n log n) | O(n log² n)| O(n²)      | O(1)     |
| Tim Sort        | O(n)       | O(n log n) | O(n log n) | O(n)     |
| Comb Sort       | O(n log n) | O(n²/2^p)  | O(n²)      | O(1)     |
| Cocktail Shaker | O(n)       | O(n²)      | O(n²)      | O(1)     |
| Counting Sort   | O(n+k)     | O(n+k)     | O(n+k)     | O(k)     |
| Radix Sort      | O(nk)      | O(nk)      | O(nk)      | O(n+k)   |
| Gnome Sort      | O(n)       | O(n²)      | O(n²)      | O(1)     |

### Graph Traversals

| Algorithm    | Time Complexity  | Space | Notes                        |
|--------------|------------------|-------|------------------------------|
| BFS          | O(V + E)         | O(V)  | Shortest path (unweighted)   |
| DFS          | O(V + E)         | O(V)  | Stack/recursion based        |
| Dijkstra's   | O((V+E) log V)   | O(V)  | Shortest path (weighted)     |
| A*           | O(E log V)       | O(V)  | Heuristic-guided search      |

---

## License

MIT — free to use, modify, and distribute.
