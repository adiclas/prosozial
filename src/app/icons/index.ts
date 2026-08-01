import { IconDef } from './icon.types';

import { homeIcon } from './home.icon';
import { arrowLeftIcon, arrowRightIcon } from './arrows.icon';
import { checkedIcon } from './checked.icon';
import { starIcon, shieldCheckIcon } from './trust.icon';
import { heartIcon, mailIcon, phoneVolumeIcon } from './care.icon';
import { truckIcon } from './delivery.icon';
import { globeIcon, bookIcon } from './globe.icon';
import { lockIcon, userIcon } from './lock.icon';
import { sparkleIcon, infoCircleIcon, triangleAlertIcon } from './specialty.icon';
import { trophyIcon, pawPrintIcon } from './team.icon';
import { rosetteCheckIcon, gaugeIcon, bulbIcon } from './badges.icon';
import { copyIcon, sendIcon, accessibilityIcon, searchIcon, menuIcon, refreshIcon } from './ui.icon';
import {
  wheelchairIcon,
  cupIcon,
  heartPulseIcon,
  showerIcon,
  bedIcon,
  dumbbellIcon,
  sosIcon,
  quoteIcon,
  badgeLeafIcon,
  awardIcon,
  certificateIcon,
  playIcon,
  settingsIcon,
} from './static.icon';

/**
 * Single source of truth for icon names used in templates.
 * To add a new itshover icon:
 *   1. Port it as a `*.icon.ts` file with an `IconDef`.
 *   2. Import + add to the `ICONS` map below.
 */
export const ICONS = {
  // Animated (itshover-derived)
  home: homeIcon,
  'arrow-right': arrowRightIcon,
  'arrow-left': arrowLeftIcon,
  check: checkedIcon,
  star: starIcon,
  'shield-check': shieldCheckIcon,
  heart: heartIcon,
  'heart-pulse': heartPulseIcon, // falls back to static
  mail: mailIcon,
  phone: phoneVolumeIcon,
  truck: truckIcon,
  globe: globeIcon,
  book: bookIcon,
  lock: lockIcon,
  user: userIcon,
  sparkle: sparkleIcon,
  'info-circle': infoCircleIcon,
  'triangle-alert': triangleAlertIcon,
  trophy: trophyIcon,
  'paw-print': pawPrintIcon,
  'rosette-check': rosetteCheckIcon,
  gauge: gaugeIcon,
  bulb: bulbIcon,
  copy: copyIcon,
  send: sendIcon,
  accessibility: accessibilityIcon,
  search: searchIcon,
  menu: menuIcon,
  refresh: refreshIcon,

  // Static (care-specific, no itshover equivalent)
  wheelchair: wheelchairIcon,
  cup: cupIcon,
  shower: showerIcon,
  bed: bedIcon,
  dumbbell: dumbbellIcon,
  sos: sosIcon,
  quote: quoteIcon,
  'badge-leaf': badgeLeafIcon,
  award: awardIcon,
  certificate: certificateIcon,
  play: playIcon,
  settings: settingsIcon,
} as const satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;
