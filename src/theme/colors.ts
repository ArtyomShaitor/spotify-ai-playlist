const COLORS = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "black",
  "white",
] as const;

const TRANSPARENCIES = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export type Color = (typeof COLORS)[number];
type Transparency = (typeof TRANSPARENCIES)[number];

export type FullColor<C extends Color = Color> = C extends "black" | "white"
  ? C
  : `${C}-${Transparency}`;

export const getColorCN = (color: Color, transparency: Transparency = 500) =>
  color === "white" || color === "black"
    ? `${color}`
    : `${color}-${transparency}`;

export const $c = getColorCN;
