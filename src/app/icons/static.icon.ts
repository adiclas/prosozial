import { IconDef } from './icon.types';

/**
 * Static fallbacks for care-specific icons that don't exist in the itshover
 * library. They render as normal SVG with no hover animation. The shape is
 * identical to `IconDef` so they can be passed to the same `<app-icon>`.
 */

const noop: [] = [];

export const wheelchairIcon: IconDef = {
  parts: [
    { id: 'w', d: 'M12 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M12 6v6 M9 22a4 4 0 0 1-4-4a4 4 0 0 1 4-4h3l3 4h3 M12 12h3l3 3v3 M9 18h6' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const cupIcon: IconDef = {
  parts: [
    { id: 'c', d: 'M5 4h12v4a6 6 0 0 1-6 6a6 6 0 0 1-6-6V4z M17 6h2a2 2 0 0 1 0 4h-2 M9 19l-1 3 M13 19l1 3' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const heartPulseIcon: IconDef = {
  parts: [
    { id: 'h', d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z M3 12h4l2-4 3 8 2-4h7' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const showerIcon: IconDef = {
  parts: [
    { id: 's', d: 'M9 4v2 M13 4v2 M11 6v16 M7 11a1 1 0 1 0 0-.001 M11 13a1 1 0 1 0 0-.001 M15 11a1 1 0 1 0 0-.001 M9 16a1 1 0 1 0 0-.001 M13 16a1 1 0 1 0 0-.001' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const bedIcon: IconDef = {
  parts: [
    { id: 'b', d: 'M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6 M3 18h18 M3 14h18 M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const dumbbellIcon: IconDef = {
  parts: [
    { id: 'd', d: 'M6 6v12 M18 6v12 M3 9v6 M21 9v6 M6 12h12' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const sosIcon: IconDef = {
  parts: [
    { id: 's', d: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 0 0 -18 0 M8 12h2 M14 12h2 M12 8v2 M12 14v2' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const quoteIcon: IconDef = {
  parts: [
    { id: 'q1', d: 'M7 7h4v6H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z' },
    { id: 'q2', d: 'M15 7h4v6h-4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const badgeLeafIcon: IconDef = {
  parts: [
    { id: 'b', d: 'M12 2l2 5h5l-4 3l1.5 5L12 12l-4.5 3L9 10L5 7h5z M12 15a3 3 0 1 0 0 6a3 3 0 0 0 0-6z M12 18v4 M9 20l3 2l3-2' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const awardIcon: IconDef = {
  parts: [
    { id: 'a', d: 'M12 9a6 6 0 1 0 0 12a6 6 0 0 0 0-12z M9 14l-2 7l5-3l5 3l-2-7' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const certificateIcon: IconDef = {
  parts: [
    { id: 'c', d: 'M3 3h18v14H3z M3 8h18 M9 13l2 2l4-4 M12 17v4 M9 21l3-2l3 2' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};

export const playIcon: IconDef = {
  parts: [
    { id: 'p', d: 'M8 5l12 7l-12 7z' },
  ],
  hoverIn: noop,
  hoverOut: noop,
};
