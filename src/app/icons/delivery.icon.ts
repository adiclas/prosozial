import { IconDef } from './icon.types';

/** Truck that drives off and comes back. */
export const truckIcon: IconDef = {
  parts: [
    { id: 'truck', d: 'M14 19V7a2 2 0 0 0-2-2H9 M15 19H9 M19 19h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14 M2 13v5a1 1 0 0 0 1 1h2 M4 3 2.15 5.15a.495.495 0 0 0 .35.86h2.15a.47.47 0 0 1 .35.86L3 9.02' },
    { id: 'wheel-1', d: 'M17 19a2 2 0 1 0 0 -.001' },
    { id: 'wheel-2', d: 'M7 19a2 2 0 1 0 0 -.001' },
  ],
  hoverIn: [
    { target: 'truck', property: 'translateX', values: [0, 30, -30, 0], duration: 1100, ease: 'ease-in-out' },
    { target: 'truck', property: 'opacity', values: [1, 0, 0, 1], duration: 1100, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'truck', property: 'translateX', values: [0], duration: 200, ease: 'ease-out' },
    { target: 'truck', property: 'opacity', values: [1], duration: 200, ease: 'ease-out' },
  ],
};
