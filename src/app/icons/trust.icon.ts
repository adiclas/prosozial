import { IconDef } from './icon.types';

/** Star outline that fills on hover and wobbles. */
export const starIcon: IconDef = {
  parts: [
    { id: 'star-outline', d: 'M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z', transformOrigin: 'center' },
    { id: 'star-fill', d: 'M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z', transformOrigin: 'center', fill: true },
  ],
  hoverIn: [
    { target: 'star-fill', property: 'opacity', values: [0, 1], duration: 400, ease: 'ease-out' },
    { target: 'star-fill', property: 'scale', values: [0.8, 1], duration: 400, ease: 'ease-out' },
    { target: 'star-outline', property: 'scale', values: [1, 1.1, 1], duration: 500, ease: 'ease-in-out' },
    { target: 'star-outline', property: 'rotate', values: [0, -5, 5, 0], duration: 500, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'star-fill', property: 'opacity', values: [0], duration: 300, ease: 'ease-out' },
    { target: 'star-outline', property: 'scale', values: [1], duration: 300, ease: 'ease-in-out' },
    { target: 'star-outline', property: 'rotate', values: [0], duration: 300, ease: 'ease-in-out' },
  ],
};

/** Shield with checkmark. Shield body bounces, checkmark draws in. */
export const shieldCheckIcon: IconDef = {
  parts: [
    { id: 'shield-body', d: 'M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06', transformOrigin: 'center' },
    { id: 'shield-check', d: 'M15 19l2 2l4 -4' },
  ],
  hoverIn: [
    { target: 'shield-body', property: 'scale', values: [1, 1.05, 1], duration: 350, ease: 'ease-out' },
    { target: 'shield-check', property: 'pathLength', values: [0, 1], duration: 300, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'shield-body', property: 'scale', values: [1], duration: 200 },
    { target: 'shield-check', property: 'pathLength', values: [1], duration: 200 },
  ],
};
