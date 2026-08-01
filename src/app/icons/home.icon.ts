import { IconDef } from './icon.types';

export const homeIcon: IconDef = {
  parts: [
    { id: 'roof', d: 'M5 12l-2 0l9 -9l9 9l-2 0' },
    { id: 'house', d: 'M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7', transformOrigin: 'center' },
    { id: 'door', d: 'M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6', transformOrigin: 'center bottom' },
  ],
  hoverIn: [
    { target: 'roof', property: 'translateY', values: [-2, 0], duration: 400, ease: 'ease-out' },
    { target: 'roof', property: 'opacity', values: [0.6, 1], duration: 400, ease: 'ease-out' },
    { target: 'house', property: 'scale', values: [0.95, 1], duration: 300, ease: 'ease-out', delay: 400 },
    { target: 'door', property: 'scaleY', values: [0, 1], duration: 300, ease: 'ease-out', delay: 700 },
  ],
  hoverOut: [
    { target: 'roof', property: 'translateY', values: [0], duration: 200, ease: 'ease-in-out' },
    { target: 'roof', property: 'opacity', values: [1], duration: 200, ease: 'ease-in-out' },
    { target: 'house', property: 'scale', values: [1], duration: 200, ease: 'ease-in-out' },
    { target: 'door', property: 'scaleY', values: [1], duration: 200, ease: 'ease-in-out' },
  ],
};
