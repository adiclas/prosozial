import { IconDef } from './icon.types';

/** Sparkles - three small stars that rotate and pulse. */
export const sparkleIcon: IconDef = {
  parts: [
    { id: 'main', d: 'M9 18a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z', transformOrigin: '9px 12px' },
    { id: 'top', d: 'M16 6a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2z', transformOrigin: '18px 6px' },
    { id: 'bottom', d: 'M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2z', transformOrigin: '18px 18px' },
  ],
  hoverIn: [
    { target: 'main', property: 'rotate', values: [0, 180], duration: 600, ease: 'ease-in-out' },
    { target: 'main', property: 'scale', values: [1, 1.2, 1], duration: 600, ease: 'ease-in-out' },
    { target: 'top', property: 'rotate', values: [0, -90], duration: 500, ease: 'ease-in-out', delay: 100 },
    { target: 'top', property: 'scale', values: [1, 0.8, 1.1], duration: 500, ease: 'ease-in-out', delay: 100 },
    { target: 'top', property: 'opacity', values: [1, 0.6, 1], duration: 500, ease: 'ease-in-out', delay: 100 },
    { target: 'bottom', property: 'rotate', values: [0, 90], duration: 500, ease: 'ease-in-out', delay: 50 },
    { target: 'bottom', property: 'scale', values: [1, 1.15, 0.9], duration: 500, ease: 'ease-in-out', delay: 50 },
    { target: 'bottom', property: 'opacity', values: [1, 0.7, 1], duration: 500, ease: 'ease-in-out', delay: 50 },
  ],
  hoverOut: [
    { target: 'main', property: 'rotate', values: [0], duration: 250 },
    { target: 'main', property: 'scale', values: [1], duration: 250 },
    { target: 'top', property: 'rotate', values: [0], duration: 250 },
    { target: 'top', property: 'scale', values: [1], duration: 250 },
    { target: 'top', property: 'opacity', values: [1], duration: 250 },
    { target: 'bottom', property: 'rotate', values: [0], duration: 250 },
    { target: 'bottom', property: 'scale', values: [1], duration: 250 },
    { target: 'bottom', property: 'opacity', values: [1], duration: 250 },
  ],
};

/** Info circle with rotating dashes. */
export const infoCircleIcon: IconDef = {
  parts: [
    { id: 'ring', d: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10z' },
    { id: 'i', d: 'M12 8v.01 M12 11v5' },
  ],
  hoverIn: [
    { target: 'ring', property: 'scale', values: [1, 1.08, 1], duration: 400, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'ring', property: 'scale', values: [1], duration: 200 },
  ],
};

/** Triangle alert with subtle shake. */
export const triangleAlertIcon: IconDef = {
  parts: [
    { id: 'tri', d: 'M12 3l10 18H2L12 3z' },
    { id: 'bang', d: 'M12 9v4 M12 17h.01' },
  ],
  hoverIn: [
    { target: 'tri', property: 'rotate', values: [0, -5, 5, -3, 3, 0], duration: 500, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'tri', property: 'rotate', values: [0], duration: 200 },
  ],
};
