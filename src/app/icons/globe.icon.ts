import { IconDef } from './icon.types';

/** Globe that rotates while hovered. */
export const globeIcon: IconDef = {
  viewBox: '0 0 48 48',
  parts: [
    { id: 'sphere', d: 'M23 33C30.732 33 37 26.732 37 19C37 11.268 30.732 5 23 5C15.268 5 9 11.268 9 19C9 26.732 15.268 33 23 33Z M14 30L15.336 28.0984C16.3999 26.5841 16.557 24.5077 15.7357 22.8151L15.5751 22.4842C14.5131 20.2955 15.1651 17.5604 17.0607 16.253L17.3292 16.0677C18.2109 15.4596 18.808 14.4478 18.9613 13.3023C19.1316 12.0291 18.7338 10.7433 17.8962 9.85981L15.3599 7.24048 M23.0628 5C22.3771 9.64991 27.3946 14.948 33.7332 10.0381 M36.6225 22.1264C34.6145 19.2959 32.3651 15.7913 28.4377 17.3428C24.4307 18.9257 30.0493 23.15 25.2064 26.9189C22.1135 29.3259 22.8515 31.6477 23.9478 33', transformOrigin: '23px 19px' },
    { id: 'stem', d: 'M23 43V38' },
    { id: 'base', d: 'M16 43H30' },
    { id: 'axis', d: 'M38 4L36.435 5.565C43.855 12.985 43.855 25.015 36.435 32.435C29.015 39.855 16.985 39.855 9.565 32.435L8 34' },
  ],
  hoverIn: [
    { target: 'sphere', property: 'rotate', values: [0, 360], duration: 2000, ease: 'linear', repeat: Infinity },
  ],
  hoverOut: [
    { target: 'sphere', property: 'rotate', values: [0], duration: 500 },
  ],
};

/** Book that opens on hover. */
export const bookIcon: IconDef = {
  parts: [
    { id: 'cover', d: 'M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z' },
    { id: 'pages', d: 'M4 17a3 3 0 0 1 3-3h11', transformOrigin: 'left center' },
  ],
  hoverIn: [
    { target: 'pages', property: 'translateX', values: [0, 2, 0], duration: 400, ease: 'ease-in-out' },
    { target: 'cover', property: 'scaleY', values: [1, 1.02, 1], duration: 300, ease: 'ease-out' },
  ],
  hoverOut: [
    { target: 'pages', property: 'translateX', values: [0], duration: 200 },
    { target: 'cover', property: 'scaleY', values: [1], duration: 200 },
  ],
};
