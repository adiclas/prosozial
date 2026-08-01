import { IconDef } from './icon.types';

/** Lock that lifts the shackle on hover. */
export const lockIcon: IconDef = {
  parts: [
    { id: 'body', d: 'M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z' },
    { id: 'keyhole', d: 'M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0' },
    { id: 'shackle', d: 'M8 11v-4a4 4 0 1 1 8 0v4', transformOrigin: '50% 100%' },
  ],
  hoverIn: [
    { target: 'shackle', property: 'rotate', values: [0, 40], duration: 280, ease: 'ease-out' },
    { target: 'shackle', property: 'translateY', values: [0, -1.7], duration: 280, ease: 'ease-out' },
    { target: 'shackle', property: 'translateX', values: [0, 3], duration: 280, ease: 'ease-out' },
  ],
  hoverOut: [
    { target: 'shackle', property: 'rotate', values: [0], duration: 220, ease: 'ease-in-out' },
    { target: 'shackle', property: 'translateY', values: [0], duration: 220, ease: 'ease-in-out' },
    { target: 'shackle', property: 'translateX', values: [0], duration: 220, ease: 'ease-in-out' },
  ],
};

/** User avatar with a head bounce. */
export const userIcon: IconDef = {
  parts: [
    { id: 'head', d: 'M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', transformOrigin: 'center' },
    { id: 'body', d: 'M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2' },
  ],
  hoverIn: [
    { target: 'head', property: 'translateY', values: [0, -1, 0], duration: 400, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'head', property: 'translateY', values: [0], duration: 200 },
  ],
};
