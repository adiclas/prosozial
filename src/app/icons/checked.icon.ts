import { IconDef, SELF_TARGET } from './icon.types';

/** Checkmark inside a circle. Animates pathLength (draw-on) + slight bounce. */
export const checkedIcon: IconDef = {
  parts: [
    { id: 'ring', d: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' },
    { id: 'check', d: 'M9 12l2 2l4 -4' },
  ],
  hoverIn: [
    { target: SELF_TARGET, property: 'scale', values: [1, 1.1, 1], duration: 200, ease: 'ease-in-out' },
    { target: 'check', property: 'pathLength', values: [0, 1], duration: 400, ease: 'ease-in-out', delay: 100 },
  ],
  hoverOut: [
    { target: SELF_TARGET, property: 'scale', values: [1], duration: 200, ease: 'ease-in-out' },
    { target: 'check', property: 'pathLength', values: [1], duration: 200 },
  ],
};
