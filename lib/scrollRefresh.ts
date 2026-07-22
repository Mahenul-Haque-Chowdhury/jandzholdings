import { ScrollTrigger } from "gsap/ScrollTrigger";

// Sections with async content (video frames, 3D model, fonts) call this once
// that content finishes loading and settles page layout, so every
// ScrollTrigger's start/end recalculates against final positions.
//
// A plain ScrollTrigger.refresh() does not reliably fix triggers that were
// created before a later pin-spacer (e.g. Hero's 300vh canvas sequence)
// pushed the rest of the page down, the refreshed start value can stay
// stale even after refresh() runs. Any component whose correct trigger
// position depends on layout that only exists after these async loads
// should instead recreate its ScrollTrigger from scratch once
// `onceLayoutSettled` fires, rather than trust refresh() to fix it in place.
// Number of distinct async sources expected to call requestScrollRefresh()
// before layout is truly final. Keep in sync with call sites (currently
// Hero's frame preload and Stats3D's model load).
const EXPECTED_REFRESH_SOURCES = 2;

let refreshCount = 0;
let settled = false;
const listeners = new Set<() => void>();

export function requestScrollRefresh() {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh();
  refreshCount += 1;
  if (!settled && refreshCount >= EXPECTED_REFRESH_SOURCES) {
    settled = true;
    listeners.forEach((cb) => cb());
    listeners.clear();
  }
}

export function onceLayoutSettled(callback: () => void) {
  if (settled) {
    callback();
    return () => {};
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}
