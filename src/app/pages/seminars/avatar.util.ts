/**
 * Generate a procedurally-styled SVG avatar as a data URL.
 * Returns a gradient + initials image (no network call required) so the
 * lecturer edit page can pre-populate an avatar for new or previously
 * un-uploaded lecturers. Each name gets a deterministic colour scheme
 * derived from a small hash so the same name always produces the same
 * avatar (consistent across renders).
 */
export interface GeneratedAvatar {
  dataUrl: string;
  background: string;
  foreground: string;
}

/** Stable hash → 32-bit unsigned int (mirrors Java's String.hashCode). */
function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/** Pick the first 1–2 characters of each whitespace-separated word. */
export function initialsOf(name: string, max = 2): string {
  return (name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, max)
    .toUpperCase();
}

/**
 * Map a number to an HSL hue (0–360). Spread across the spectrum so the
 * palette covers the full range as the name hash changes.
 */
function hueFromHash(h: number): number {
  return h % 360;
}

/** Pick a tasteful two-color background pair based on the hash. */
function pickPalette(h: number): { background: string; foreground: string } {
  // Three coordinated palettes rotated by the hash — using real prosozial
  // brand tones plus complementary accents so generated avatars look
  // intentional rather than random.
  const palettes: { background: string; foreground: string }[] = [
    { background: 'linear-gradient(135deg, #0a4a35 0%, #007F41 60%, #1e9656 100%)', foreground: '#ffffff' },
    { background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)', foreground: '#f1f5f9' },
    { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #60a5fa 100%)', foreground: '#ffffff' },
    { background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)', foreground: '#ffffff' },
    { background: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #db2777 100%)', foreground: '#ffffff' },
    { background: 'linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #2dd4bf 100%)', foreground: '#ffffff' },
  ];
  // Slight per-name offset so different names with the same index still vary
  const offset = (h >> 4) % palettes.length;
  return palettes[(h % palettes.length + offset) % palettes.length];
}

/**
 * Render a 300×300 SVG avatar with initials on a colored gradient.
 * The avatar is a data URL (image/svg+xml) suitable for `<img src>`.
 */
export function generateAvatar(name: string): GeneratedAvatar {
  return generateAvatarWith(name, hashString((name ?? '').trim().toLowerCase()));
}

/** Same as `generateAvatar` but accepts an explicit seed — used to render
 *  the same avatar variant consistently across the picker UI. */
export function generateAvatarWith(name: string, seed: number): GeneratedAvatar {
  const safe = (name ?? '').trim() || '?';
  const palette = pickPalette(seed);
  const init = initialsOf(safe, 2) || '?';
  const fontSize = init.length === 1 ? 150 : 110;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">` +
    `<defs><linearGradient id="g${seed}" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0%" stop-color="${extractStops(palette.background).a}"/>` +
    `<stop offset="100%" stop-color="${extractStops(palette.background).b}"/>` +
    `</linearGradient></defs>` +
    `<rect width="300" height="300" fill="url(#g${seed})"/>` +
    `<text x="150" y="${150 + fontSize * 0.35}" ` +
    `font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, sans-serif" ` +
    `font-size="${fontSize}" font-weight="600" ` +
    `fill="${palette.foreground}" text-anchor="middle" dominant-baseline="middle">` +
    `${escapeXml(init)}</text>` +
    `</svg>`;
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return {
    dataUrl: `data:image/svg+xml;charset=utf-8,${encoded}`,
    background: palette.background,
    foreground: palette.foreground,
  };
}

/**
 * The set of preset avatar variants exposed in the picker's "Select from
 * presets" gallery. Each one renders a slightly different palette so the
 * user can pick the one that fits the lecturer's character.
 */
export const AVATAR_PRESETS: { label: string; seeds: number[] }[] = [
  { label: 'Klassisch Grün',   seeds: [0, 100, 200, 300, 400, 500] },
  { label: 'Anthrazit',         seeds: [60, 160, 260, 360, 460, 560] },
  { label: 'Royal Blau',        seeds: [120, 220, 320, 420, 520, 620] },
  { label: 'Violett',           seeds: [180, 280, 380, 480, 580, 680] },
  { label: 'Magenta',           seeds: [40, 240, 340, 440, 640, 740] },
  { label: 'Türkis',            seeds: [80, 280, 380, 480, 680, 880] },
];

/** Generate one preset avatar for the picker gallery (one per seed). */
export function generatePreset(name: string, seed: number) {
  return generateAvatarWith(name, seed);
}

/** Best-effort gradient stop extractor — used to keep the inline gradient
 *  inside the SVG consistent with the palette passed back. */
function extractStops(linear: string): { a: string; b: string } {
  // Default endpoints if we can't parse (e.g. hex / not gradient syntax)
  const fallback = { a: '#007F41', b: '#1e9656' };
  const colors = linear.match(/#[0-9a-fA-F]{3,8}/g);
  if (!colors || colors.length < 2) return fallback;
  return { a: colors[0], b: colors[colors.length - 1] };
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}