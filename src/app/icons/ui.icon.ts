import { IconDef } from './icon.types';

/** Copy / duplicate icon - top card slides. */
export const copyIcon: IconDef = {
  parts: [
    { id: 'back', d: 'M4 16.7a2 2 0 0 1 -1 -1.7v-10a2 2 0 0 1 2 -2h10a2 2 0 0 1 1.5 .7' },
    { id: 'front', d: 'M7 7m0 2.7a2.7 2.7 0 0 1 2.7 -2.7h8.6a2.7 2.7 0 0 1 2.7 2.7v8.6a2.7 2.7 0 0 1 -2.7 2.7h-8.6a2.7 2.7 0 0 1 -2.7 -2.7z' },
  ],
  hoverIn: [
    { target: 'front', property: 'translateX', values: [0, 2, 0], duration: 300, ease: 'ease-in-out' },
    { target: 'front', property: 'translateY', values: [0, 2, 0], duration: 300, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'front', property: 'translateX', values: [0], duration: 200, ease: 'ease-out' },
    { target: 'front', property: 'translateY', values: [0], duration: 200, ease: 'ease-out' },
  ],
};

/** Send / paper plane that flies off and comes back. */
export const sendIcon: IconDef = {
  parts: [
    { id: 'plane', d: 'M10 14l11 -11 M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5', transformOrigin: 'center' },
  ],
  hoverIn: [
    { target: 'plane', property: 'translateX', values: [0, 24, -24, 0], duration: 600, ease: 'ease-in-out' },
    { target: 'plane', property: 'translateY', values: [0, -24, 24, 0], duration: 600, ease: 'ease-in-out' },
    { target: 'plane', property: 'opacity', values: [1, 0, 0, 1], duration: 600, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'plane', property: 'translateX', values: [0], duration: 200 },
    { target: 'plane', property: 'translateY', values: [0], duration: 200 },
    { target: 'plane', property: 'opacity', values: [1], duration: 200 },
  ],
};

/** Accessibility / wheelchair symbol. */
export const accessibilityIcon: IconDef = {
  parts: [
    { id: 'wheel', d: 'M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0z M9 17l-1.5 -4.5l4 -1.5l3.5 1.5l3 -1', transformOrigin: 'center' },
  ],
  hoverIn: [
    { target: 'wheel', property: 'rotate', values: [0, 360], duration: 1500, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'wheel', property: 'rotate', values: [0], duration: 300 },
  ],
};

/** Search magnifier. */
export const searchIcon: IconDef = {
  parts: [
    { id: 'lens', d: 'M11 4a7 7 0 1 1-4.95 11.95A7 7 0 0 1 11 4z', transformOrigin: 'center' },
    { id: 'handle', d: 'M16 16l5 5' },
  ],
  hoverIn: [
    { target: 'lens', property: 'scale', values: [1, 1.1, 1], duration: 300, ease: 'ease-in-out' },
    { target: 'handle', property: 'rotate', values: [0, 45, 0], duration: 400, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'lens', property: 'scale', values: [1], duration: 200 },
    { target: 'handle', property: 'rotate', values: [0], duration: 200 },
  ],
};

/** Menu / hamburger (3 lines). */
export const menuIcon: IconDef = {
  parts: [
    { id: 'line-1', d: 'M3 6h18', transformOrigin: 'center' },
    { id: 'line-2', d: 'M3 12h18', transformOrigin: 'center' },
    { id: 'line-3', d: 'M3 18h18', transformOrigin: 'center' },
  ],
  hoverIn: [
    { target: 'line-1', property: 'translateX', values: [0, -2, 0], duration: 300, ease: 'ease-in-out' },
    { target: 'line-3', property: 'translateX', values: [0, 2, 0], duration: 300, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'line-1', property: 'translateX', values: [0], duration: 200 },
    { target: 'line-3', property: 'translateX', values: [0], duration: 200 },
  ],
};

/** Refresh / reload - circular arrow that spins on hover. */
export const refreshIcon: IconDef = {
  parts: [
    { id: 'arrow', d: 'M3 12a9 9 0 0 1 15.5 -6.3L21 8 M21 3v5h-5 M21 12a9 9 0 0 1 -15.5 6.3L3 16 M3 21v-5h5', transformOrigin: 'center' },
  ],
  hoverIn: [
    { target: 'arrow', property: 'rotate', values: [0, 360], duration: 600, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'arrow', property: 'rotate', values: [0], duration: 200 },
  ],
};
