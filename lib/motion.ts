// Single source of truth for motion physics across the site.
// Entrances decelerate (`*.out`), exits accelerate (`*.in`), moves use `inOut`.
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
} as const;

export const DUR = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  hero: 1.6,
} as const;

export const STAGGER = {
  chars: 0.025,
  words: 0.05,
  items: 0.12,
} as const;
