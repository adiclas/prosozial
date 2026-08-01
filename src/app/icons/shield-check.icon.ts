import { IconDef } from './icon.types';

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
