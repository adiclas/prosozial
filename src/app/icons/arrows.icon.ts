import { IconDef } from './icon.types';

export const arrowRightIcon: IconDef = {
  parts: [{ id: 'arrow', d: 'M5 12l14 0 M15 16l4 -4 M15 8l4 4' }],
  hoverIn: [{ target: 'arrow', property: 'translateX', values: [0, 4, 0], duration: 500, ease: 'ease-in-out' }],
  hoverOut: [{ target: 'arrow', property: 'translateX', values: [0], duration: 200, ease: 'ease-out' }],
};

export const arrowLeftIcon: IconDef = {
  parts: [{ id: 'arrow', d: 'M19 12H5 M11 6l-6 6 6 6' }],
  hoverIn: [{ target: 'arrow', property: 'translateX', values: [0, -4, 0], duration: 500, ease: 'ease-in-out' }],
  hoverOut: [{ target: 'arrow', property: 'translateX', values: [0], duration: 200, ease: 'ease-out' }],
};
