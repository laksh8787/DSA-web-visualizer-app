// ============================================================
// algorithms/sorting.js — All 12 sorting algorithm step generators
// Each function returns an array of "steps" describing state at each moment.
// Step shape: { arr, comparing, swapping, sorted, pivot, pseudoLine, log }
// ============================================================

function makeStep(arr, opts = {}) {
  return {
    arr: [...arr],
    comparing: opts.comparing ?? [],
    swapping:  opts.swapping  ?? [],
    sorted:    opts.sorted    ?? [],
    pivot:     opts.pivot     ?? -1,
    pseudoLine:opts.pseudoLine ?? -1,
    log:       opts.log       ?? '',
    logType:   opts.logType   ?? 'info',
    comparisons: opts.comparisons ?? 0,
    swaps:     opts.swaps     ?? 0,
  };
}

// ---- Bubble Sort ----
export function bubbleSort(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  let comps = 0, swps = 0;
  const sorted = new Set();

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comps++;
      steps.push(makeStep(arr, { comparing: [j, j+1], sorted: [...sorted], pseudoLine: 1, log: `Compare arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}`, comparisons: comps, swaps: swps }));
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        swps++;
        steps.push(makeStep(arr, { swapping: [j, j+1], sorted: [...sorted], pseudoLine: 3, log: `Swap → arr[${j}]=${arr[j]}, arr[${j+1}]=${arr[j+1]}`, logType: 'swap', comparisons: comps, swaps: swps }));
      }
    }
    sorted.add(n - 1 - i);
    steps.push(makeStep(arr, { sorted: [...sorted], pseudoLine: 4, log: `Position ${n-1-i} is sorted`, logType: 'done', comparisons: comps, swaps: swps }));
  }
  sorted.add(0);
  steps.push(makeStep(arr, { sorted: [...sorted], pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Selection Sort ----
export function selectionSort(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  let comps = 0, swps = 0;
  const sorted = new Set();

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push(makeStep(arr, { comparing: [i], sorted: [...sorted], pseudoLine: 1, log: `Find min starting from index ${i}`, comparisons: comps, swaps: swps }));
    for (let j = i + 1; j < n; j++) {
      comps++;
      steps.push(makeStep(arr, { comparing: [minIdx, j], sorted: [...sorted], pseudoLine: 3, log: `Compare arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}`, comparisons: comps, swaps: swps }));
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push(makeStep(arr, { comparing: [minIdx], sorted: [...sorted], pseudoLine: 4, log: `New min found at index ${minIdx} (value=${arr[minIdx]})`, comparisons: comps, swaps: swps }));
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swps++;
      steps.push(makeStep(arr, { swapping: [i, minIdx], sorted: [...sorted], pseudoLine: 5, log: `Swap arr[${i}] and arr[${minIdx}]`, logType: 'swap', comparisons: comps, swaps: swps }));
    }
    sorted.add(i);
    steps.push(makeStep(arr, { sorted: [...sorted], pseudoLine: -1, log: `Index ${i} is sorted`, logType: 'done', comparisons: comps, swaps: swps }));
  }
  sorted.add(n - 1);
  steps.push(makeStep(arr, { sorted: [...sorted], pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Insertion Sort ----
export function insertionSort(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  let comps = 0, swps = 0;
  const sorted = new Set([0]);

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    steps.push(makeStep(arr, { comparing: [i], sorted: [...sorted], pseudoLine: 1, log: `Insert key=${key} at position ${i}`, comparisons: comps, swaps: swps }));
    while (j >= 0 && arr[j] > key) {
      comps++;
      steps.push(makeStep(arr, { comparing: [j, j+1], sorted: [...sorted], pseudoLine: 3, log: `arr[${j}]=${arr[j]} > key=${key}, shift right`, comparisons: comps, swaps: swps }));
      arr[j + 1] = arr[j];
      swps++;
      steps.push(makeStep(arr, { swapping: [j, j+1], sorted: [...sorted], pseudoLine: 4, log: `Shift arr[${j}] → arr[${j+1}]`, logType: 'swap', comparisons: comps, swaps: swps }));
      j--;
    }
    arr[j + 1] = key;
    sorted.add(i);
    steps.push(makeStep(arr, { sorted: [...sorted], pseudoLine: 5, log: `Placed key=${key} at index ${j+1}`, logType: 'done', comparisons: comps, swaps: swps }));
  }
  steps.push(makeStep(arr, { sorted: [...Array.from({length: n}, (_,i)=>i)], pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Merge Sort ----
export function mergeSort(input) {
  const arr = [...input];
  const steps = [];
  let comps = 0, swps = 0;
  const sorted = new Set();

  function merge(a, l, m, r) {
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      comps++;
      steps.push(makeStep(a, { comparing: [l+i, m+1+j], sorted: [...sorted], pseudoLine: 5, log: `Merge: compare ${left[i]} and ${right[j]}`, comparisons: comps, swaps: swps }));
      if (left[i] <= right[j]) { a[k++] = left[i++]; }
      else { a[k++] = right[j++]; swps++; }
      steps.push(makeStep(a, { swapping: [k-1], sorted: [...sorted], pseudoLine: 5, log: `Placed ${a[k-1]} at index ${k-1}`, logType: 'swap', comparisons: comps, swaps: swps }));
    }
    while (i < left.length) { a[k++] = left[i++]; }
    while (j < right.length) { a[k++] = right[j++]; }
    for (let x = l; x <= r; x++) sorted.add(x);
    steps.push(makeStep(a, { sorted: [...sorted], pseudoLine: -1, log: `Merged range [${l}..${r}]`, logType: 'done', comparisons: comps, swaps: swps }));
  }

  function sort(a, l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    steps.push(makeStep(a, { comparing: [l, r], pseudoLine: 2, log: `Split [${l}..${r}] at mid=${m}`, comparisons: comps, swaps: swps }));
    sort(a, l, m);
    sort(a, m + 1, r);
    merge(a, l, m, r);
  }

  sort(arr, 0, arr.length - 1);
  return steps;
}

// ---- Quick Sort ----
export function quickSort(input) {
  const arr = [...input];
  const steps = [];
  let comps = 0, swps = 0;
  const sorted = new Set();

  function partition(a, low, high) {
    const pivot = a[high];
    steps.push(makeStep(a, { pivot: high, sorted: [...sorted], pseudoLine: 2, log: `Pivot = arr[${high}] = ${pivot}`, comparisons: comps, swaps: swps }));
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comps++;
      steps.push(makeStep(a, { comparing: [j, high], pivot: high, sorted: [...sorted], pseudoLine: 4, log: `Compare arr[${j}]=${a[j]} ≤ pivot=${pivot}?`, comparisons: comps, swaps: swps }));
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        swps++;
        steps.push(makeStep(a, { swapping: [i, j], pivot: high, sorted: [...sorted], pseudoLine: 5, log: `Swap arr[${i}] and arr[${j}]`, logType: 'swap', comparisons: comps, swaps: swps }));
      }
    }
    [a[i+1], a[high]] = [a[high], a[i+1]];
    swps++;
    sorted.add(i+1);
    steps.push(makeStep(a, { swapping: [i+1, high], sorted: [...sorted], pseudoLine: 6, log: `Place pivot at index ${i+1}`, logType: 'done', comparisons: comps, swaps: swps }));
    return i + 1;
  }

  function sort(a, low, high) {
    if (low < high) {
      const pi = partition(a, low, high);
      sort(a, low, pi - 1);
      sort(a, pi + 1, high);
    } else if (low === high) {
      sorted.add(low);
    }
  }

  sort(arr, 0, arr.length - 1);
  steps.push(makeStep(arr, { sorted: [...Array.from({length: arr.length}, (_,i)=>i)], pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Heap Sort ----
export function heapSort(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  let comps = 0, swps = 0;
  const sorted = new Set();

  function heapify(a, size, root) {
    let largest = root;
    const l = 2 * root + 1;
    const r = 2 * root + 2;
    if (l < size) { comps++; if (a[l] > a[largest]) largest = l; }
    if (r < size) { comps++; if (a[r] > a[largest]) largest = r; }
    steps.push(makeStep(a, { comparing: [root, largest], sorted: [...sorted], pseudoLine: 6, log: `Heapify: root=${root}, largest=${largest}`, comparisons: comps, swaps: swps }));
    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      swps++;
      steps.push(makeStep(a, { swapping: [root, largest], sorted: [...sorted], pseudoLine: 6, log: `Swap arr[${root}] and arr[${largest}]`, logType: 'swap', comparisons: comps, swaps: swps }));
      heapify(a, size, largest);
    }
  }

  for (let i = Math.floor(n/2) - 1; i >= 0; i--) {
    steps.push(makeStep(arr, { comparing: [i], sorted: [...sorted], pseudoLine: 0, log: `Build max heap: heapify at ${i}`, comparisons: comps, swaps: swps }));
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    swps++;
    sorted.add(i);
    steps.push(makeStep(arr, { swapping: [0, i], sorted: [...sorted], pseudoLine: 2, log: `Extract max=${arr[i]} to position ${i}`, logType: 'swap', comparisons: comps, swaps: swps }));
    heapify(arr, i, 0);
  }
  sorted.add(0);
  steps.push(makeStep(arr, { sorted: [...sorted], pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Shell Sort ----
export function shellSort(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  let comps = 0, swps = 0;
  const sorted = new Set();

  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    steps.push(makeStep(arr, { pseudoLine: 0, log: `Gap = ${gap}`, comparisons: comps, swaps: swps }));
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      steps.push(makeStep(arr, { comparing: [i], pseudoLine: 2, log: `Insert arr[${i}]=${temp} with gap=${gap}`, comparisons: comps, swaps: swps }));
      while (j >= gap && arr[j - gap] > temp) {
        comps++;
        arr[j] = arr[j - gap];
        swps++;
        steps.push(makeStep(arr, { swapping: [j, j-gap], pseudoLine: 6, log: `Shift arr[${j-gap}] → arr[${j}]`, logType: 'swap', comparisons: comps, swaps: swps }));
        j -= gap;
      }
      arr[j] = temp;
    }
  }
  const allSorted = Array.from({length: n}, (_,i) => i);
  steps.push(makeStep(arr, { sorted: allSorted, pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Counting Sort ----
export function countingSort(input) {
  const arr = [...input];
  const steps = [];
  let comps = 0, swps = 0;

  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  steps.push(makeStep(arr, { pseudoLine: 0, log: `Max value = ${max}, count array size = ${max+1}`, comparisons: comps, swaps: swps }));

  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
    steps.push(makeStep(arr, { comparing: [i], pseudoLine: 1, log: `Count arr[${i}]=${arr[i]} → count[${arr[i]}]=${count[arr[i]]}`, comparisons: comps, swaps: swps }));
  }

  for (let i = 1; i <= max; i++) {
    count[i] += count[i-1];
    steps.push(makeStep(arr, { pseudoLine: 3, log: `Prefix sum: count[${i}] = ${count[i]}`, comparisons: comps, swaps: swps }));
  }

  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[--count[arr[i]]] = arr[i];
    swps++;
    steps.push(makeStep(output.map(x => x ?? 0), { swapping: [count[arr[i]]], pseudoLine: 5, log: `Place ${arr[i]} at position ${count[arr[i]]}`, logType: 'swap', comparisons: comps, swaps: swps }));
  }

  const sorted = Array.from({length: arr.length}, (_,i) => i);
  steps.push(makeStep(output, { sorted, pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Radix Sort ----
export function radixSort(input) {
  const arr = [...input];
  const steps = [];
  let comps = 0, swps = 0;

  function countSortByDigit(a, exp) {
    const output = new Array(a.length).fill(0);
    const count = new Array(10).fill(0);
    steps.push(makeStep(a, { pseudoLine: 1, log: `Processing digit at position 10^${Math.log10(exp)|0}`, comparisons: comps, swaps: swps }));
    for (let i = 0; i < a.length; i++) {
      const digit = Math.floor(a[i] / exp) % 10;
      count[digit]++;
      steps.push(makeStep(a, { comparing: [i], pseudoLine: 3, log: `Digit of ${a[i]} at exp=${exp} is ${digit}`, comparisons: comps, swaps: swps }));
    }
    for (let i = 1; i < 10; i++) count[i] += count[i-1];
    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10;
      output[--count[digit]] = a[i];
      swps++;
    }
    for (let i = 0; i < a.length; i++) a[i] = output[i];
    steps.push(makeStep(a, { pseudoLine: 5, log: `Sorted by digit at exp=${exp}`, logType: 'swap', comparisons: comps, swaps: swps }));
  }

  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countSortByDigit(arr, exp);
  }

  const sorted = Array.from({length: arr.length}, (_,i) => i);
  steps.push(makeStep(arr, { sorted, pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Gnome Sort ----
export function gnomeSort(input) {
  const arr = [...input];
  const steps = [];
  let comps = 0, swps = 0;
  let i = 0;
  const sorted = new Set();

  while (i < arr.length) {
    if (i === 0) {
      steps.push(makeStep(arr, { comparing: [i], pseudoLine: 2, log: `At position 0, move forward`, comparisons: comps, swaps: swps }));
      i++;
    } else if (arr[i] >= arr[i-1]) {
      comps++;
      steps.push(makeStep(arr, { comparing: [i-1, i], sorted: [...sorted], pseudoLine: 3, log: `arr[${i}]=${arr[i]} >= arr[${i-1}]=${arr[i-1]}, move forward`, comparisons: comps, swaps: swps }));
      i++;
    } else {
      comps++;
      [arr[i], arr[i-1]] = [arr[i-1], arr[i]];
      swps++;
      steps.push(makeStep(arr, { swapping: [i, i-1], sorted: [...sorted], pseudoLine: 5, log: `Swap arr[${i}] and arr[${i-1}]`, logType: 'swap', comparisons: comps, swaps: swps }));
      i--;
    }
  }

  const allSorted = Array.from({length: arr.length}, (_,i) => i);
  steps.push(makeStep(arr, { sorted: allSorted, pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Cocktail Shaker Sort ----
export function cocktailSort(input) {
  const arr = [...input];
  const steps = [];
  let comps = 0, swps = 0;
  const sorted = new Set();
  let start = 0, end = arr.length - 1;

  while (start < end) {
    for (let i = start; i < end; i++) {
      comps++;
      steps.push(makeStep(arr, { comparing: [i, i+1], sorted: [...sorted], pseudoLine: 1, log: `Forward: compare arr[${i}]=${arr[i]} and arr[${i+1}]=${arr[i+1]}`, comparisons: comps, swaps: swps }));
      if (arr[i] > arr[i+1]) {
        [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
        swps++;
        steps.push(makeStep(arr, { swapping: [i, i+1], sorted: [...sorted], pseudoLine: 2, log: `Swap → ${arr[i]}, ${arr[i+1]}`, logType: 'swap', comparisons: comps, swaps: swps }));
      }
    }
    sorted.add(end--);
    for (let i = end; i > start; i--) {
      comps++;
      steps.push(makeStep(arr, { comparing: [i-1, i], sorted: [...sorted], pseudoLine: 4, log: `Backward: compare arr[${i-1}]=${arr[i-1]} and arr[${i}]=${arr[i]}`, comparisons: comps, swaps: swps }));
      if (arr[i-1] > arr[i]) {
        [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
        swps++;
        steps.push(makeStep(arr, { swapping: [i-1, i], sorted: [...sorted], pseudoLine: 5, log: `Swap → ${arr[i-1]}, ${arr[i]}`, logType: 'swap', comparisons: comps, swaps: swps }));
      }
    }
    sorted.add(start++);
  }

  const allSorted = Array.from({length: arr.length}, (_,i) => i);
  steps.push(makeStep(arr, { sorted: allSorted, pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Comb Sort ----
export function combSort(input) {
  const arr = [...input];
  const steps = [];
  let comps = 0, swps = 0;
  const n = arr.length;
  let gap = n;
  const shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) { gap = 1; sorted = true; }
    steps.push(makeStep(arr, { pseudoLine: 0, log: `Gap = ${gap}`, comparisons: comps, swaps: swps }));
    for (let i = 0; i + gap < n; i++) {
      comps++;
      steps.push(makeStep(arr, { comparing: [i, i+gap], pseudoLine: 2, log: `Compare arr[${i}]=${arr[i]} and arr[${i+gap}]=${arr[i+gap]}`, comparisons: comps, swaps: swps }));
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i+gap]] = [arr[i+gap], arr[i]];
        swps++;
        sorted = false;
        steps.push(makeStep(arr, { swapping: [i, i+gap], pseudoLine: 3, log: `Swap arr[${i}] and arr[${i+gap}]`, logType: 'swap', comparisons: comps, swaps: swps }));
      }
    }
  }

  const allSorted = Array.from({length: n}, (_,i) => i);
  steps.push(makeStep(arr, { sorted: allSorted, pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Tim Sort (simplified) ----
export function timSort(input) {
  const arr = [...input];
  const steps = [];
  const n = arr.length;
  let comps = 0, swps = 0;
  const RUN = 8;
  const sorted = new Set();

  // Insertion sort for runs
  function insertionSortRun(a, left, right) {
    for (let i = left + 1; i <= right; i++) {
      const key = a[i];
      let j = i - 1;
      steps.push(makeStep(a, { comparing: [i], pseudoLine: 0, log: `Run insertion: key=${key}`, comparisons: comps, swaps: swps }));
      while (j >= left && a[j] > key) {
        comps++;
        a[j+1] = a[j];
        swps++;
        steps.push(makeStep(a, { swapping: [j, j+1], pseudoLine: 1, log: `Shift ${a[j+1]} right`, logType: 'swap', comparisons: comps, swaps: swps }));
        j--;
      }
      a[j+1] = key;
    }
  }

  function merge(a, l, m, r) {
    const left = a.slice(l, m+1);
    const right = a.slice(m+1, r+1);
    let i=0, j=0, k=l;
    while (i < left.length && j < right.length) {
      comps++;
      if (left[i] <= right[j]) a[k++] = left[i++];
      else { a[k++] = right[j++]; swps++; }
      steps.push(makeStep(a, { swapping: [k-1], pseudoLine: 4, log: `Merge: placed ${a[k-1]} at ${k-1}`, logType: 'swap', comparisons: comps, swaps: swps }));
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];
    for (let x=l; x<=r; x++) sorted.add(x);
  }

  for (let i = 0; i < n; i += RUN) {
    insertionSortRun(arr, i, Math.min(i + RUN - 1, n - 1));
  }

  for (let size = RUN; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1);
      const right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) {
        steps.push(makeStep(arr, { comparing: [left, right], sorted: [...sorted], pseudoLine: 3, log: `Merge runs [${left}..${mid}] and [${mid+1}..${right}]`, comparisons: comps, swaps: swps }));
        merge(arr, left, mid, right);
      }
    }
  }

  const allSorted = Array.from({length: n}, (_,i) => i);
  steps.push(makeStep(arr, { sorted: allSorted, pseudoLine: -1, log: 'Array sorted!', logType: 'done', comparisons: comps, swaps: swps }));
  return steps;
}

// ---- Algorithm metadata ----
export const SORT_ALGORITHMS = {
  bubble:    { name: 'Bubble Sort',         badge: 'n²',    complexity: { best: 'O(n)', avg: 'O(n²)',       worst: 'O(n²)',     space: 'O(1)'     }, desc: 'Repeatedly steps through the list, compares adjacent elements and swaps them if in the wrong order. Simple but inefficient for large data.', pseudo: ['<span class="kw">for</span> i = 0 <span class="kw">to</span> n-1:', '  <span class="kw">for</span> j = 0 <span class="kw">to</span> n-i-2:', '    <span class="kw">if</span> arr[j] > arr[j+1]:', '      <span class="fn">swap</span>(arr[j], arr[j+1])', '    mark arr[n-i-1] as sorted'], fn: bubbleSort },
  selection: { name: 'Selection Sort',      badge: 'n²',    complexity: { best: 'O(n²)', avg: 'O(n²)',     worst: 'O(n²)',     space: 'O(1)'     }, desc: 'Divides array into sorted and unsorted parts. Repeatedly selects the minimum element from the unsorted part and places it at the beginning.', pseudo: ['<span class="kw">for</span> i = 0 <span class="kw">to</span> n-1:', '  minIdx = i', '  <span class="kw">for</span> j = i+1 <span class="kw">to</span> n:', '    <span class="kw">if</span> arr[j] < arr[minIdx]: minIdx = j', '  <span class="fn">swap</span>(arr[i], arr[minIdx])'], fn: selectionSort },
  insertion: { name: 'Insertion Sort',      badge: 'n²',    complexity: { best: 'O(n)', avg: 'O(n²)',       worst: 'O(n²)',     space: 'O(1)'     }, desc: 'Builds the sorted array one element at a time by inserting each element into its correct position. Efficient for small or nearly sorted arrays.', pseudo: ['<span class="kw">for</span> i = 1 <span class="kw">to</span> n-1:', '  key = arr[i]; j = i - 1', '  <span class="kw">while</span> j >= 0 <span class="kw">and</span> arr[j] > key:', '    arr[j+1] = arr[j]; j--', '  arr[j+1] = key'], fn: insertionSort },
  merge:     { name: 'Merge Sort',          badge: 'nlogn', complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' }, desc: 'Divides the array in half, recursively sorts each half, then merges the sorted halves. Stable, predictable performance.', pseudo: ['<span class="fn">mergeSort</span>(arr, l, r):', '  <span class="kw">if</span> l >= r: <span class="kw">return</span>', '  mid = (l + r) / 2', '  <span class="fn">mergeSort</span>(arr, l, mid)', '  <span class="fn">mergeSort</span>(arr, mid+1, r)', '  <span class="fn">merge</span>(arr, l, mid, r)'], fn: mergeSort },
  quick:     { name: 'Quick Sort',          badge: 'nlogn', complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)',   space: 'O(log n)' }, desc: 'Selects a pivot and partitions the array around it, recursively sorting sub-arrays. Very fast in practice despite O(n²) worst case.', pseudo: ['<span class="fn">quickSort</span>(arr, low, high):', '  <span class="kw">if</span> low < high:', '    pivot = arr[high]; i = low - 1', '    <span class="kw">for</span> j = low <span class="kw">to</span> high-1:', '      <span class="kw">if</span> arr[j] <= pivot: i++; <span class="fn">swap</span>', '    <span class="fn">swap</span>(arr[i+1], arr[high])'], fn: quickSort },
  heap:      { name: 'Heap Sort',           badge: 'nlogn', complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }, desc: 'Builds a max-heap then repeatedly extracts the maximum element. In-place with guaranteed O(n log n) but poor cache performance.', pseudo: ['<span class="fn">buildMaxHeap</span>(arr)', '<span class="kw">for</span> i = n-1 <span class="kw">to</span> 1:', '  <span class="fn">swap</span>(arr[0], arr[i])', '  <span class="fn">heapify</span>(arr, i, 0)', '  ...', '<span class="fn">heapify</span>: find largest, swap if needed'], fn: heapSort },
  shell:     { name: 'Shell Sort',          badge: 'nlogn', complexity: { best: 'O(n log n)', avg: 'O(n log² n)', worst: 'O(n²)', space: 'O(1)'  }, desc: 'Generalization of insertion sort. Allows exchange of far-apart elements by using a decreasing gap sequence.', pseudo: ['gap = n / 2', '<span class="kw">while</span> gap > 0:', '  <span class="kw">for</span> i = gap <span class="kw">to</span> n:', '    temp = arr[i]; j = i', '    <span class="kw">while</span> j>=gap <span class="kw">and</span> arr[j-gap]>temp:', '      arr[j]=arr[j-gap]; j-=gap', '  gap = floor(gap/1.3)'], fn: shellSort },
  counting:  { name: 'Counting Sort',       badge: 'n',     complexity: { best: 'O(n+k)', avg: 'O(n+k)',   worst: 'O(n+k)',    space: 'O(k)'     }, desc: 'Non-comparison sort. Counts occurrences of each value and reconstructs the sorted array. Only works for integers in a known range.', pseudo: ['max = <span class="fn">findMax</span>(arr)', 'count[0..max] = 0', '<span class="kw">for</span> x <span class="kw">in</span> arr: count[x]++', '<span class="kw">for</span> i=1 <span class="kw">to</span> max: count[i]+=count[i-1]', '<span class="fn">build</span> output from count array'], fn: countingSort },
  radix:     { name: 'Radix Sort',          badge: 'n',     complexity: { best: 'O(nk)', avg: 'O(nk)',     worst: 'O(nk)',     space: 'O(n+k)'   }, desc: 'Sorts integers digit by digit, from least significant to most significant, using counting sort as a subroutine.', pseudo: ['max = <span class="fn">findMax</span>(arr)', '<span class="kw">for</span> exp=1; max/exp>0; exp*=10:', '  <span class="fn">countSort</span>(arr, exp)', '  count digits at position exp', '  prefix sums → output array'], fn: radixSort },
  gnome:     { name: 'Gnome Sort',          badge: 'n²',    complexity: { best: 'O(n)', avg: 'O(n²)',       worst: 'O(n²)',     space: 'O(1)'     }, desc: 'Works by swapping adjacent elements like a garden gnome sorting flower pots. Similar to insertion sort but moves elements using swaps.', pseudo: ['i = 0', '<span class="kw">while</span> i < n:', '  <span class="kw">if</span> i == 0: i++', '  <span class="kw">else if</span> arr[i] >= arr[i-1]: i++', '  <span class="kw">else</span>: <span class="fn">swap</span>(arr[i], arr[i-1]); i--'], fn: gnomeSort },
  cocktail:  { name: 'Cocktail Shaker',     badge: 'n²',    complexity: { best: 'O(n)', avg: 'O(n²)',       worst: 'O(n²)',     space: 'O(1)'     }, desc: 'Bidirectional bubble sort. Traverses the list in both directions alternately, which slightly improves on bubble sort for some inputs.', pseudo: ['<span class="kw">while</span> start < end:', '  <span class="kw">for</span> i=start <span class="kw">to</span> end: bubble forward', '  end--', '  <span class="kw">for</span> i=end <span class="kw">to</span> start: bubble back', '  start++'], fn: cocktailSort },
  comb:      { name: 'Comb Sort',           badge: 'nlogn', complexity: { best: 'O(n log n)', avg: 'O(n²/2^p)', worst: 'O(n²)', space: 'O(1)'  }, desc: 'Improves on bubble sort by using a gap larger than 1. The gap starts large and shrinks by a shrink factor of ~1.3 each pass.', pseudo: ['gap = n; shrink = 1.3', '<span class="kw">while</span> gap > 1 or swapped:', '  gap = floor(gap/1.3)', '  <span class="kw">for</span> i=0 <span class="kw">to</span> n-gap:', '    <span class="kw">if</span> arr[i] > arr[i+gap]: <span class="fn">swap</span>'], fn: combSort },
  tim:       { name: 'Tim Sort',            badge: 'nlogn', complexity: { best: 'O(n)', avg: 'O(n log n)',   worst: 'O(n log n)', space: 'O(n)'  }, desc: 'Hybrid of merge sort and insertion sort. Divides array into small runs sorted with insertion sort, then merges with merge sort. Used in Python and Java.', pseudo: ['<span class="kw">for</span> i=0; i<n; i+=RUN:', '  <span class="fn">insertionSort</span>(arr, i, min(i+RUN-1,n-1))', '<span class="kw">for</span> size=RUN; size<n; size*=2:', '  <span class="kw">for</span> left=0; left<n; left+=2*size:', '    <span class="fn">merge</span>(arr, left, mid, right)'], fn: timSort },
};
