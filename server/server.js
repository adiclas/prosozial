/* eslint-disable */
/**
 * Prosozial mock backend.
 *
 * - GET  /api/content        — returns the current SiteContent (auto-seeds on first call)
 * - PUT  /api/content        — replaces the content with the request body
 * - POST /api/content/reset  — restores the bundled defaults
 * - GET  /api/health         — liveness probe
 *
 * Persists to ./server/content.json so changes survive server restarts and
 * are visible to every browser hitting the dev server.
 *
 * To swap for a real backend later: replace this file with your real API
 * and keep the same four routes — the Angular app doesn't care.
 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'content.json');

/* ============================================================
   YouTube oembed helpers (no API key required)
   https://www.youtube.com/oembed?url=…&format=json
   ============================================================ */
const OEMBED_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const oembedCache = new Map(); // videoId -> { ts, data }

function extractYouTubeId(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (!s) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname === 'youtu.be') {
      return u.pathname.replace(/^\//, '').split('/')[0] || null;
    }
    if (u.hostname.endsWith('youtube.com') || u.hostname.endsWith('youtube-nocookie.com')) {
      const v = u.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const m = u.pathname.match(/\/(embed|shorts|v|live)\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[2];
    }
  } catch { /* fall through */ }
  return null;
}

function fetchOembed(videoId) {
  return new Promise((resolve, reject) => {
    const cached = oembedCache.get(videoId);
    if (cached && Date.now() - cached.ts < OEMBED_TTL_MS) {
      return resolve(cached.data);
    }
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
    https
      .get(url, { headers: { 'User-Agent': 'ProsozialCMS/1.0' } }, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`oembed ${res.statusCode}`));
        }
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            oembedCache.set(videoId, { ts: Date.now(), data });
            resolve(data);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

const DEFAULT_CONTENT = {
  header: {
    brand: 'Prosozial',
    navLinks: [
      { label: 'Produkte', href: '#produkte' },
      { label: 'Über uns', href: '#ueber-uns' },
      { label: 'Ablauf', href: '#ablauf' },
      { label: 'Für Pflegeeinrichtungen', href: '#b2b' },
      { label: 'Bewertungen', href: '#bewertungen' },
      { label: 'Kontakt', href: '#kontakt' },
    ],
    ctaLabel: 'Kostenlose Beratung',
    ctaHref: '/login',
  },
  hero: {
    eyebrow: 'Hilfsmittel · Pflege · Beratung',
    titleLine1: 'Selbstbestimmt leben.',
    titleLine2: 'Mit den richtigen Hilfsmitteln.',
    titleLine2Accent: true,
    lead: 'Sichere, geprüfte und komfortable Produkte für Mobilität, Alltag und Pflege — persönlich beraten, schnell geliefert und auf Wunsch direkt mit Ihrer Krankenkasse abgerechnet.',
    ctaPrimary: { label: 'Beratung starten', href: '/login' },
    ctaSecondary: { label: 'Produkte entdecken', href: '#produkte' },
    trustItems: [
      { icon: 'shield-check', label: 'TÜV-geprüfte Qualität' },
      { icon: 'truck', label: 'Lieferung in 24 Stunden' },
      { icon: 'lock', label: 'DSGVO-konform & sicher' },
    ],
    cardTitle: 'Mobilität',
    cardSubtitle: 'Über 320 Produkte auf Lager',
    cardIcon: 'wheelchair',
    cardTopText: 'Kostenfrei beraten lassen',
    ratingScore: '4,9 / 5',
    ratingCount: '1.240 Bewertungen',
    avatars: [
      { initials: 'S', color: '#9ed4ad' },
      { initials: 'M', color: '#74c189' },
      { initials: 'A', color: '#4daf6a' },
    ],
  },
  featuresHeader: { eyebrow: 'Unsere Kategorien', title: 'Drei Wege zu mehr Selbstständigkeit', text: 'Von Mobilität über Alltag bis Pflege — wir haben die passenden Hilfsmittel, die echte Probleme lösen.' },
  features: [
    { title: 'Mobilität & Gehhilfen', description: 'Rollstühle, Rollatoren und Gehhilfen für mehr Selbstständigkeit im Alltag.', icon: 'wheelchair', highlight: true, cta: 'Sortiment ansehen' },
    { title: 'Alltagshilfen', description: 'Bewährte Helfer für Küche, Bad und Haushalt — ergonomisch und durchdacht.', icon: 'cup', highlight: false, cta: 'Mehr erfahren' },
    { title: 'Pflege & Hygiene', description: 'Professionelle Produkte für die häusliche und stationäre Pflege.', icon: 'heart-pulse', highlight: false, cta: 'Auswahl entdecken' },
  ],
  servicesHeader: { eyebrow: 'Vollständiges Sortiment', title: 'Hilfsmittel für jede Lebenslage', text: 'Sechs sorgfältig kuratierte Kategorien — alles aus einer Hand.' },
  services: [
    { title: 'Rollstühle & Rollatoren', description: 'Leicht, faltbar und individuell anpassbar — für mehr Bewegungsfreiheit.', icon: 'wheelchair' },
    { title: 'Bad & WC Sicherheit', description: 'Haltegriffe, Duschsitze und Toilettensitzerhöhungen für sicheren Alltag.', icon: 'shower' },
    { title: 'Bett & Schlafen', description: 'Pflegebetten, Matratzen und Lagerungshilfen für erholsamen Schlaf.', icon: 'bed' },
    { title: 'Therapie & Fitness', description: 'Trainingsgeräte und Bewegungshilfen für Reha und Prävention.', icon: 'dumbbell' },
    { title: 'Notruf & Sicherheit', description: 'Hausnotruf und Sturzsensoren — schnelle Hilfe auf Knopfdruck.', icon: 'sos' },
    { title: 'Haushaltshilfen', description: 'Greifhilfen, Öffner und Alltagshelfer für mehr Selbstständigkeit.', icon: 'home' },
  ],
  showcase: {
    beforeLabel: 'Ohne Beratung', beforeTitle: 'Vorher', beforeNote: 'Ungeeignetes Hilfsmittel, hohe Sturzgefahr',
    afterLabel: 'Mit Prosozial', afterTitle: 'Nachher', afterNote: 'Passende Lösung, mehr Selbstständigkeit',
    step1Title: 'Kostenlose Beratung', step1Text: 'Wir hören zu und verstehen Ihre Situation.',
    step2Title: 'Passgenaue Empfehlung', step2Text: 'Wir wählen das richtige Hilfsmittel aus.',
    step3Title: 'Lieferung & Aufbau', step3Text: 'Wir liefern und kümmern uns um die Abrechnung.',
  },
  videosHeader: { eyebrow: 'Bewegtbild', title: 'Unsere Kunden im Video', text: 'Echte Geschichten, echte Hilfsmittel — sehen Sie, wie Prosozial den Alltag verändert.' },
  videos: {
    playlistUrl: 'https://www.youtube.com/playlist?list=PLzQVhNQUOyxEIqAc3h4Q5K0qpBDbqAG33',
    // Real prosozial TV video IDs (first 6 of 31). Admin can add/remove via
    // /admin → Videos → YouTube-Playlist → Video-IDs.
    videoIds: [
      'ehP_2yoCyxo', // Ausbildung und Spaß bei prosozial!
      'scclA6RDcsw', // BFW-Hausmesse 2025 …
      'zJL-JWnbGmo', // Koblenz, du warst der Hammer! Azubispot …
      '3HzXqF-wj0k', // Zurück auf der JOBNOX 2025 …
      'xyCrQFBA1EA', // Tag 10 der Einführungswochen …
      '6PHW5bEqPDA', // Tag 6 der Einführungswochen …
    ],
  },
  seminarsHeader: { eyebrow: 'Wissen & Praxis', title: 'Seminare & Schulungen', text: 'Lernen Sie von Expert:innen — kompakte Seminare zu allen Themen rund um Pflege, Hilfsmittel und butler-Finanzverwaltung.' },
  seminars: {
    header: { eyebrow: 'Seminare', title: 'Aktuelle Schulungen & Termine', text: 'Wählen Sie ein Seminar aus der Liste, um Details, Termine und Inhalte zu sehen.' },
    seminars: [
      {
        id: 'butler-finanztraining',
        title: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten',
        status: 'fully-booked',
        provider: 'butler – Customer Support',
        location: 'prosozial GmbH',
        supplierLocation: '56112 Lahnstein, Koblenzer Straße 34 A',
        cost: '298,00 € tax excl.',
        description: 'In diesem zweitägigen Kurs lernen Sie, butlers Werkzeuge zur Vermögensverwaltung in der Praxis effizient einzusetzen — von der Anlage neuer Konten bis zur Kommunikation mit Banken und Gläubigern.',
        bullets: [
          'Maintain accounts and the associated postings',
          'Find and resolve any balance discrepancies that may have arisen',
          'Fully map the finances of your patients',
          'Conduct correspondence with banks and creditors',
          'Assign the "laundry basket" of receipts to accounting in butler tidy',
          'Set up and operate',
        ],
        dates: [
          { date: 'Donnerstag, 06. August 2026', sessions: [
            { time: '10:00 – 12:30', title: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten' },
            { time: '12:30 – 13:30', title: 'Mittagspause' },
            { time: '10:00 – 12:30', title: 'butler Finanztraining: Vermögen und Schulden Ihrer Patienten' },
          ]},
          { date: 'Freitag, 07. August 2026', sessions: [
            { time: '09:00 – 12:30', title: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten' },
            { time: '12:30 – 13:30', title: 'Mittagspause' },
            { time: '13:30 – 16:00', title: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten' },
          ]},
        ],
        lecturerIds: ['silke-gehrmann'],
        documents: [{ label: 'Anreiseübersicht.pdf', url: '/assets/seminars/anreiseuebersicht.pdf' }],
      },
      {
        id: 'pflegekasse-update-2026',
        title: 'Pflegekasse-Update 2026: Neue Regeln & Anträge',
        status: 'few-seats',
        provider: 'prosozial – Akademie',
        location: 'prosozial GmbH, Seminarraum 2',
        supplierLocation: '56112 Lahnstein, Koblenzer Straße 34 A',
        cost: '149,00 € tax incl.',
        description: 'Was hat sich 2026 bei Pflegekasse und Hilfsmittelverordnung geändert? Ein kompakter Vormittag mit den wichtigsten Änderungen, Praxisbeispielen und Zeit für Ihre Fragen.',
        bullets: [
          'Überblick über die Änderungen 2026',
          'Auswirkungen auf laufende Anträge',
          'Häufige Ablehnungsgründe und wie Sie darauf reagieren',
          'Live: Ausfüllen eines Musterantrags',
        ],
        dates: [
          { date: 'Mittwoch, 16. September 2026', sessions: [
            { time: '09:00 – 12:00', title: 'Pflegekasse-Update 2026' },
            { time: '12:00 – 13:00', title: 'Mittagspause' },
            { time: '13:00 – 15:00', title: 'Praxis-Workshop: Anträge ausfüllen' },
          ]},
        ],
        lecturerIds: ['klaus-werner'],
        documents: [],
      },
    ],
  },
  badgesHeader: { eyebrow: 'Vertrauen & Sicherheit', title: 'Zertifikate, auf die Sie sich verlassen können', text: 'Sicherheit, Qualität und Datenschutz sind bei uns keine Floskeln — sondern geprüft.' },
  badges: [
    { title: 'TÜV geprüft', description: 'Alle Produkte werden nach deutschen Sicherheitsstandards geprüft.', icon: 'shield-check' },
    { title: 'CE-zertifiziert', description: 'Medizinprodukte mit vollständiger EU-Konformität.', icon: 'certificate' },
    { title: 'ISO 13485', description: 'Zertifiziertes Qualitätsmanagement für Medizinprodukte.', icon: 'award' },
    { title: 'DSGVO-konform', description: 'Ihre Daten werden ausschließlich in der EU verarbeitet.', icon: 'lock' },
    { title: 'Lieferung in 24h', description: 'Lagernde Artikel noch am selben Tag auf dem Weg zu Ihnen.', icon: 'truck' },
    { title: 'Faire Preise', description: 'Direkt vom Hersteller — ohne teure Zwischenhändler.', icon: 'badge-leaf' },
  ],
  guarantee: {
    title: 'Zufriedenheits-Garantie',
    text: '30 Tage Rückgaberecht auf alle lagernden Produkte. Falls etwas nicht passt, holen wir es kostenfrei bei Ihnen ab.',
    items: ['Kostenfreier Rückversand', 'Schnelle Erstattung', 'Persönlicher Ansprechpartner'],
    sealIcon: 'badge-leaf',
  },
  plans: [
    { name: 'Beratung', badge: '', price: '0 €', period: 'kostenlos', description: 'Erstgespräch mit unseren Hilfsmittel-Experten — unverbindlich.', features: ['Telefonische Erstberatung', 'Empfehlung passender Hilfsmittel', 'Hilfe bei der Kostenkasse-Anfrage'], cta: 'Termin vereinbaren', variant: 'basic' },
    { name: 'Komplett-Paket', badge: 'Beliebt', price: '49 €', period: '/ Jahr', description: 'Rundum-Sorglos für zu Hause — Lieferung, Wartung und Beratung inklusive.', features: ['Persönliche Vor-Ort-Beratung', 'Lieferung & Aufbau', 'Wartung & Sicherheitscheck', 'Kostenfreier Ersatz bei Defekt'], cta: 'Jetzt starten', variant: 'featured' },
    { name: 'Pflege-Einrichtung', badge: '', price: 'Auf Anfrage', period: 'individuell', description: 'Maßgeschneiderte Versorgung für Pflegeheime und ambulante Dienste.', features: ['Rahmenverträge & Konditionen', 'Eigener Ansprechpartner', 'Schulung Ihres Teams', 'Monatliche Auswertung'], cta: 'Angebot anfordern', variant: 'premium' },
  ],
  teamTitle: 'Unser Beratungsteam',
  teamText: 'Erfahrene Spezialisten, die sich Zeit für Sie nehmen — telefonisch oder vor Ort.',
  team: [
    { name: 'Anna Vogt', role: 'Hilfsmittel-Beraterin', rating: 5, avatarColor: '#9ed4ad', initials: 'AV' },
    { name: 'Markus Lehner', role: 'Pflege-Spezialist', rating: 5, avatarColor: '#74c189', initials: 'ML' },
    { name: 'Sophia Bach', role: 'Ergotherapeutin', rating: 5, avatarColor: '#4daf6a', initials: 'SB' },
  ],
  ctaStrip: {
    eyebrow: 'Bereit loszulegen?',
    title: 'Wir beraten Sie kostenlos und unverbindlich.',
    text: 'Vereinbaren Sie jetzt einen Termin — telefonisch, per Video oder direkt bei Ihnen vor Ort. Wir finden das passende Hilfsmittel für Ihre Situation.',
    ctaLabel: 'Beratung anfragen',
    ctaHref: '/login',
    phoneLabel: '0800 123 456 78',
    phoneHref: 'tel:+498012345678',
  },
  footer: {
    brand: 'Prosozial',
    description: 'Prosozial — Hilfsmittel und Beratung für ein selbstbestimmtes Leben. Seit 2008 Ihr verlässlicher Partner in Deutschland.',
    contact: [
      { icon: 'phone', text: '0800 123 456 78' },
      { icon: 'mail', text: 'service@prosozial.de' },
    ],
    columns: [
      { title: 'Sortiment', links: [{ label: 'Mobilität', href: '#' }, { label: 'Alltagshilfen', href: '#' }, { label: 'Pflege & Hygiene', href: '#' }, { label: 'Therapie & Fitness', href: '#' }, { label: 'Notruf', href: '#' }] },
      { title: 'Service', links: [{ label: 'Beratung', href: '#' }, { label: 'Kostenübernahme', href: '#' }, { label: 'Lieferung & Aufbau', href: '#' }, { label: 'Reklamation', href: '#' }, { label: 'Hilfe-Center', href: '#' }] },
      { title: 'Unternehmen', links: [{ label: 'Über uns', href: '#' }, { label: 'Karriere', href: '#' }, { label: 'Presse', href: '#' }, { label: 'Nachhaltigkeit', href: '#' }, { label: 'Partner', href: '#' }] },
    ],
    copyright: '© 2026 Prosozial GmbH · Alle Rechte vorbehalten',
    legal: [{ label: 'Impressum', href: '#' }, { label: 'Datenschutz', href: '#' }, { label: 'AGB', href: '#' }],
  },
  lecturers: [
    { id: 'silke-gehrmann', name: 'Silke Gehrmann', role: 'Trainerin · butler Customer Support', avatarColor: '#007F41', expertise: ['butler', 'Finanzverwaltung', 'Schulungen'], order: 1 },
    { id: 'klaus-werner',   name: 'Klaus Werner',   role: 'Pflegedienstleiter & Dozent',     avatarColor: '#0f172a', expertise: ['Pflegekasse', 'Hilfsmittelverordnung'], order: 2 },
    { id: 'anna-vogt',      name: 'Anna Vogt',      role: 'Hilfsmittel-Beraterin',           avatarColor: '#9ed4ad', expertise: ['Mobilität', 'Alltagshilfen', 'Beratung'], order: 3 },
    { id: 'markus-lehner',  name: 'Markus Lehner',  role: 'Pflege-Spezialist',               avatarColor: '#74c189', expertise: ['Demenz', 'Häusliche Pflege'], order: 4 },
    { id: 'sophia-bach',    name: 'Sophia Bach',    role: 'Ergotherapeutin',                 avatarColor: '#4daf6a', expertise: ['Therapie', 'Rehabilitation'], order: 5 },
  ],
};

// ---- File I/O ----
function readContent() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf8');
      return DEFAULT_CONTENT;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const stored = JSON.parse(raw);
    const merged = { ...DEFAULT_CONTENT, ...stored };

    // One-time migration: if the global lecturer pool is empty but the
    // old `team` field still has members, copy them over and persist.
    if (
      (!Array.isArray(merged.lecturers) || merged.lecturers.length === 0) &&
      Array.isArray(merged.team) &&
      merged.team.length > 0
    ) {
      merged.lecturers = merged.team.map((m, i) => ({
        id: slugify(m.name) || `lecturer-${i + 1}`,
        name: m.name,
        role: m.role,
        avatarColor: m.avatarColor,
      }));
      try { writeContent(merged); } catch { /* best-effort */ }
    }

    // Ensure every seminar has a lecturerIds array. If the old embedded
    // `lecturers` array is present, drop it (lecturers live in the global
    // pool now).
    if (Array.isArray(merged.seminars?.seminars)) {
      for (const s of merged.seminars.seminars) {
        if (!Array.isArray(s.lecturerIds)) s.lecturerIds = [];
        delete s.lecturers;
      }
    }

    return merged;
  } catch (err) {
    console.error('[server] failed to read content.json, falling back to defaults:', err);
    return DEFAULT_CONTENT;
  }
}

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function writeContent(next) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2), 'utf8');
}

// ---- App ----
const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.get('/api/content', (_req, res) => {
  res.json(readContent());
});

app.put('/api/content', (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Body must be a SiteContent object' });
  }
  try {
    writeContent(req.body);
    res.json({ ok: true, ts: Date.now() });
  } catch (err) {
    console.error('[server] failed to persist content:', err);
    res.status(500).json({ error: 'Failed to persist' });
  }
});

app.post('/api/content/reset', (_req, res) => {
  try {
    writeContent(DEFAULT_CONTENT);
    res.json({ ok: true, ts: Date.now() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset' });
  }
});

/* ============================================================
   YouTube metadata — accepts a list of video IDs (or URLs), returns
   oembed data per video. Server-cached for 24h. No API key needed.
   ============================================================ */
app.post('/api/youtube/videos', async (req, res) => {
  const inputs = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const ids = inputs.map(extractYouTubeId).filter(Boolean);
  if (ids.length === 0) {
    return res.json({ items: [], errors: [] });
  }
  const items = await Promise.all(
    ids.map(async (id) => {
      try {
        const data = await fetchOembed(id);
        return {
          id,
          title: data.title || '',
          author: data.author_name || '',
          authorUrl: data.author_url || '',
          thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        };
      } catch (err) {
        return { id, error: String(err.message || err) };
      }
    }),
  );
  res.json({ items });
});

app.listen(PORT, () => {
  // Touch the file so the first GET returns something deterministic
  readContent();
  console.log(`[server] Prosozial API listening on http://127.0.0.1:${PORT}`);
  console.log(`[server]   GET  /api/content`);
  console.log(`[server]   PUT  /api/content`);
  console.log(`[server]   POST /api/content/reset`);
});
