import { IconDef } from './icon.types';

/** Heart pulse animation. */
export const heartIcon: IconDef = {
  parts: [
    { id: 'heart', d: 'M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572', transformOrigin: 'center' },
  ],
  hoverIn: [
    { target: 'heart', property: 'scale', values: [1, 1.15, 1, 1.25, 1], duration: 600, ease: 'ease-out' },
  ],
  hoverOut: [
    { target: 'heart', property: 'scale', values: [1], duration: 200, ease: 'ease-out' },
  ],
};

/** Phone handset with two wave arcs. */
export const phoneVolumeIcon: IconDef = {
  viewBox: '0 0 32 32',
  parts: [
    { id: 'phone-body', d: 'm21.38 18.27l-3.17 3.97c-3.49-2.05-6.4-4.96-8.45-8.45l3.97-3.18L9.9 2l-6.46 1.68c-.94.25-1.56 1.16-1.42 2.13 1.76 12.55 11.63 22.42 24.18 24.18.97.13 1.88-.48 2.13-1.42l1.68-6.46-8.62-3.83z' },
    { id: 'wave-inner', d: 'm19 8c2.76 0 5 2.24 5 5', transformOrigin: '21.5px 10.5px' },
    { id: 'wave-outer', d: 'm19 3c5.52 0 10 4.48 10 10', transformOrigin: '24px 8px' },
  ],
  hoverIn: [
    { target: 'wave-inner', property: 'scale', values: [1, 1.25, 1], duration: 450, ease: 'ease-in-out' },
    { target: 'wave-inner', property: 'opacity', values: [0.4, 1, 0.4], duration: 450, ease: 'ease-in-out' },
    { target: 'wave-outer', property: 'scale', values: [1, 1.25, 1], duration: 450, ease: 'ease-in-out', delay: 100 },
    { target: 'wave-outer', property: 'opacity', values: [0.2, 0.8, 0.2], duration: 450, ease: 'ease-in-out', delay: 100 },
  ],
  hoverOut: [
    { target: 'wave-inner', property: 'scale', values: [1], duration: 200, ease: 'ease-in-out' },
    { target: 'wave-inner', property: 'opacity', values: [1], duration: 200, ease: 'ease-in-out' },
    { target: 'wave-outer', property: 'scale', values: [1], duration: 200, ease: 'ease-in-out' },
    { target: 'wave-outer', property: 'opacity', values: [1], duration: 200, ease: 'ease-in-out' },
  ],
};

/** Mail envelope - top flap rotates open on hover. */
export const mailIcon: IconDef = {
  parts: [
    { id: 'body', d: 'M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z' },
    { id: 'flap', d: 'M3 7l9 6l9 -6', transformOrigin: 'center top' },
  ],
  hoverIn: [
    { target: 'flap', property: 'rotateX', values: [0, -60], duration: 500, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'flap', property: 'rotateX', values: [0], duration: 500, ease: 'ease-in-out' },
  ],
};
