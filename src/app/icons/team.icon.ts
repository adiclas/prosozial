import { IconDef } from './icon.types';

/** Trophy with confetti burst on hover. */
export const trophyIcon: IconDef = {
  parts: [
    { id: 'trophy', d: 'M6 9H4.5a1 1 0 0 1 0-5H6 M18 9h1.5a1 1 0 0 0 0-5H18 M4 22h16 M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978 M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978 M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z', transformOrigin: 'center 20px' },
    { id: 'confetti-1', d: 'M11 6h2v2h-2z', transformOrigin: 'center' },
    { id: 'confetti-2', d: 'M12 5h2v2h-2z', transformOrigin: 'center' },
    { id: 'confetti-3', d: 'M13 6h2v2h-2z', transformOrigin: 'center' },
    { id: 'confetti-4', d: 'M12 7h2v2h-2z', transformOrigin: 'center' },
  ],
  hoverIn: [
    { target: 'trophy', property: 'translateY', values: [0, -4, -4, 0], duration: 800, ease: 'ease-out' },
    { target: 'trophy', property: 'rotate', values: [0, -10, 10, 0], duration: 800, ease: 'ease-out' },
    { target: 'confetti-1', property: 'translateX', values: [0, -12], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-1', property: 'translateY', values: [0, -15], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-1', property: 'rotate', values: [0, 140], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-1', property: 'opacity', values: [0, 1, 0], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-2', property: 'translateX', values: [0, -5], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-2', property: 'translateY', values: [0, -18], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-2', property: 'rotate', values: [0, -100], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-2', property: 'opacity', values: [0, 1, 0], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-3', property: 'translateX', values: [0, 5], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-3', property: 'translateY', values: [0, -18], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-3', property: 'rotate', values: [0, 120], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-3', property: 'opacity', values: [0, 1, 0], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-4', property: 'translateX', values: [0, 12], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-4', property: 'translateY', values: [0, -15], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-4', property: 'rotate', values: [0, -140], duration: 800, ease: 'ease-out', delay: 100 },
    { target: 'confetti-4', property: 'opacity', values: [0, 1, 0], duration: 800, ease: 'ease-out', delay: 100 },
  ],
  hoverOut: [
    { target: 'trophy', property: 'translateY', values: [0], duration: 300 },
    { target: 'trophy', property: 'rotate', values: [0], duration: 300 },
    { target: 'confetti-1', property: 'opacity', values: [0], duration: 200 },
    { target: 'confetti-2', property: 'opacity', values: [0], duration: 200 },
    { target: 'confetti-3', property: 'opacity', values: [0], duration: 200 },
    { target: 'confetti-4', property: 'opacity', values: [0], duration: 200 },
  ],
};

/** Paw print - for empathy/care themes. */
export const pawPrintIcon: IconDef = {
  parts: [
    { id: 'pad', d: 'M12 19a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3z', transformOrigin: 'center' },
    { id: 'toe-1', d: 'M9 7a2 2 0 1 1-4 0a2 2 0 0 1 4 0z', transformOrigin: 'center' },
    { id: 'toe-2', d: 'M19 7a2 2 0 1 1-4 0a2 2 0 0 1 4 0z', transformOrigin: 'center' },
    { id: 'toe-3', d: 'M6 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0z', transformOrigin: 'center' },
    { id: 'toe-4', d: 'M22 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0z', transformOrigin: 'center' },
  ],
  hoverIn: [
    { target: 'pad', property: 'scale', values: [1, 1.15, 1], duration: 400, ease: 'ease-in-out' },
    { target: 'toe-1', property: 'translateY', values: [0, -1, 0], duration: 400, ease: 'ease-in-out' },
    { target: 'toe-2', property: 'translateY', values: [0, -1, 0], duration: 400, ease: 'ease-in-out' },
    { target: 'toe-3', property: 'translateX', values: [0, -1, 0], duration: 400, ease: 'ease-in-out' },
    { target: 'toe-4', property: 'translateX', values: [0, 1, 0], duration: 400, ease: 'ease-in-out' },
  ],
  hoverOut: [
    { target: 'pad', property: 'scale', values: [1], duration: 200 },
    { target: 'toe-1', property: 'translateY', values: [0], duration: 200 },
    { target: 'toe-2', property: 'translateY', values: [0], duration: 200 },
    { target: 'toe-3', property: 'translateX', values: [0], duration: 200 },
    { target: 'toe-4', property: 'translateX', values: [0], duration: 200 },
  ],
};
