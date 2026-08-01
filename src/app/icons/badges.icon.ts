import { IconDef } from './icon.types';

/** Rosette with check - for guarantee / quality badges. */
export const rosetteCheckIcon: IconDef = {
  parts: [
    { id: 'rosette', d: 'M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1z', transformOrigin: 'center' },
    { id: 'check', d: 'M9 12l2 2l4 -4' },
  ],
  hoverIn: [
    { target: 'rosette', property: 'rotate', values: [0, -5, 5, 0], duration: 500, ease: 'ease-in-out' },
    { target: 'rosette', property: 'scale', values: [1, 1.05, 1], duration: 500, ease: 'ease-in-out' },
    { target: 'check', property: 'pathLength', values: [0, 1], duration: 400, ease: 'ease-out' },
    { target: 'rosette', property: 'scale', values: [1, 1.05, 0.98, 1], duration: 300, ease: 'ease-out', delay: 500 },
  ],
  hoverOut: [
    { target: 'rosette', property: 'rotate', values: [0], duration: 200 },
    { target: 'rosette', property: 'scale', values: [1], duration: 200 },
    { target: 'check', property: 'pathLength', values: [1], duration: 200 },
  ],
};

/** Gauge - meter dial. */
export const gaugeIcon: IconDef = {
  parts: [
    { id: 'arc', d: 'M12 14l4 -4' },
    { id: 'dial', d: 'M3 12a9 9 0 0 1 18 0' },
  ],
  hoverIn: [
    { target: 'arc', property: 'rotate', values: [0, 30, -10, 0], duration: 600, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'arc', property: 'rotate', values: [0], duration: 200 },
  ],
};

/** Light bulb that lights up. */
export const bulbIcon: IconDef = {
  parts: [
    { id: 'bulb', d: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7c.6 .5 1 1.3 1 2v.3h6v-.3c0-.7 .4-1.5 1-2A7 7 0 0 0 12 2z' },
    { id: 'shine', d: 'M12 6v3 M9 7l1.5 1.5 M15 7l-1.5 1.5' },
  ],
  hoverIn: [
    { target: 'bulb', property: 'scale', values: [1, 1.05, 1], duration: 300, ease: 'ease-in-out' },
    { target: 'shine', property: 'opacity', values: [0, 1, 0.6], duration: 600, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'bulb', property: 'scale', values: [1], duration: 200 },
    { target: 'shine', property: 'opacity', values: [0], duration: 200 },
  ],
};
