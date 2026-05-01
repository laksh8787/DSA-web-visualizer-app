// ============================================================
// utils/helpers.js — Shared utility functions
// ============================================================

/** Generate a random integer in [min, max] */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generate a shuffled array of unique values */
export function generateArray(size, min = 4, max = 98) {
  return Array.from({ length: size }, () => randInt(min, max));
}

/** Deep clone a plain array */
export function cloneArr(arr) {
  return [...arr];
}

/** Sleep helper (for animation delays — not used in step-mode but useful) */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Map a speed value (1–10) to a delay in ms */
export function speedToDelay(speed) {
  // speed 1 → 800ms, speed 10 → 20ms
  return Math.round(800 / speed);
}

/** Format large numbers with commas */
export function formatNum(n) {
  return n.toLocaleString();
}

/** Clamp a value between min and max */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
