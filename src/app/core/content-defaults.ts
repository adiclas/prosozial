import { SiteContent } from './content.types';

/**
 * Default content shipped with the app. Used as the seed for the content
 * service on first run, and as the "reset" target in the admin editor.
 *
 * The values here mirror the original hardcoded home page so the live page
 * looks identical until an admin edits something.
 */
export const DEFAULT_CONTENT: SiteContent = {
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

  featuresHeader: {
    eyebrow: 'Unsere Kategorien',
    title: 'Drei Wege zu mehr Selbstständigkeit',
    text: 'Von Mobilität über Alltag bis Pflege — wir haben die passenden Hilfsmittel, die echte Probleme lösen.',
  },
  features: [
    {
      title: 'Mobilität & Gehhilfen',
      description: 'Rollstühle, Rollatoren und Gehhilfen für mehr Selbstständigkeit im Alltag.',
      icon: 'wheelchair',
      highlight: true,
      cta: 'Sortiment ansehen',
    },
    {
      title: 'Alltagshilfen',
      description: 'Bewährte Helfer für Küche, Bad und Haushalt — ergonomisch und durchdacht.',
      icon: 'cup',
      highlight: false,
      cta: 'Mehr erfahren',
    },
    {
      title: 'Pflege & Hygiene',
      description: 'Professionelle Produkte für die häusliche und stationäre Pflege.',
      icon: 'heart-pulse',
      highlight: false,
      cta: 'Auswahl entdecken',
    },
  ],

  servicesHeader: {
    eyebrow: 'Vollständiges Sortiment',
    title: 'Hilfsmittel für jede Lebenslage',
    text: 'Sechs sorgfältig kuratierte Kategorien — alles aus einer Hand.',
  },
  services: [
    { title: 'Rollstühle & Rollatoren', description: 'Leicht, faltbar und individuell anpassbar — für mehr Bewegungsfreiheit.', icon: 'wheelchair' },
    { title: 'Bad & WC Sicherheit', description: 'Haltegriffe, Duschsitze und Toilettensitzerhöhungen für sicheren Alltag.', icon: 'shower' },
    { title: 'Bett & Schlafen', description: 'Pflegebetten, Matratzen und Lagerungshilfen für erholsamen Schlaf.', icon: 'bed' },
    { title: 'Therapie & Fitness', description: 'Trainingsgeräte und Bewegungshilfen für Reha und Prävention.', icon: 'dumbbell' },
    { title: 'Notruf & Sicherheit', description: 'Hausnotruf und Sturzsensoren — schnelle Hilfe auf Knopfdruck.', icon: 'sos' },
    { title: 'Haushaltshilfen', description: 'Greifhilfen, Öffner und Alltagshelfer für mehr Selbstständigkeit.', icon: 'home' },
  ],

  showcase: {
    beforeLabel: 'Ohne Beratung',
    beforeTitle: 'Vorher',
    beforeNote: 'Ungeeignetes Hilfsmittel, hohe Sturzgefahr',
    afterLabel: 'Mit Prosozial',
    afterTitle: 'Nachher',
    afterNote: 'Passende Lösung, mehr Selbstständigkeit',
    step1Title: 'Kostenlose Beratung',
    step1Text: 'Wir hören zu und verstehen Ihre Situation.',
    step2Title: 'Passgenaue Empfehlung',
    step2Text: 'Wir wählen das richtige Hilfsmittel aus.',
    step3Title: 'Lieferung & Aufbau',
    step3Text: 'Wir liefern und kümmern uns um die Abrechnung.',
  },

  videosHeader: {
    eyebrow: 'Bewegtbild',
    title: 'Unsere Kunden im Video',
    text: 'Echte Geschichten, echte Hilfsmittel — sehen Sie, wie Prosozial den Alltag verändert.',
  },
  videos: {
    playlistUrl: 'https://www.youtube.com/playlist?list=PLzQVhNQUOyxEIqAc3h4Q5K0qpBDbqAG33',
    videoIds: ['g1mEFsG2Ebg', 'hXBgPzS3CuE', '4YvU0Ag9Kbg', '2vIXYYp9z2w'],
  },

  badgesHeader: {
    eyebrow: 'Vertrauen & Sicherheit',
    title: 'Zertifikate, auf die Sie sich verlassen können',
    text: 'Sicherheit, Qualität und Datenschutz sind bei uns keine Floskeln — sondern geprüft.',
  },
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
    items: [
      'Kostenfreier Rückversand',
      'Schnelle Erstattung',
      'Persönlicher Ansprechpartner',
    ],
    sealIcon: 'badge-leaf',
  },

  plans: [
    {
      name: 'Beratung',
      badge: '',
      price: '0 €',
      period: 'kostenlos',
      description: 'Erstgespräch mit unseren Hilfsmittel-Experten — unverbindlich.',
      features: [
        'Telefonische Erstberatung',
        'Empfehlung passender Hilfsmittel',
        'Hilfe bei der Kostenkasse-Anfrage',
      ],
      cta: 'Termin vereinbaren',
      variant: 'basic',
    },
    {
      name: 'Komplett-Paket',
      badge: 'Beliebt',
      price: '49 €',
      period: '/ Jahr',
      description: 'Rundum-Sorglos für zu Hause — Lieferung, Wartung und Beratung inklusive.',
      features: [
        'Persönliche Vor-Ort-Beratung',
        'Lieferung & Aufbau',
        'Wartung & Sicherheitscheck',
        'Kostenfreier Ersatz bei Defekt',
      ],
      cta: 'Jetzt starten',
      variant: 'featured',
    },
    {
      name: 'Pflege-Einrichtung',
      badge: '',
      price: 'Auf Anfrage',
      period: 'individuell',
      description: 'Maßgeschneiderte Versorgung für Pflegeheime und ambulante Dienste.',
      features: [
        'Rahmenverträge & Konditionen',
        'Eigener Ansprechpartner',
        'Schulung Ihres Teams',
        'Monatliche Auswertung',
      ],
      cta: 'Angebot anfordern',
      variant: 'premium',
    },
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
      {
        title: 'Sortiment',
        links: [
          { label: 'Mobilität', href: '#' },
          { label: 'Alltagshilfen', href: '#' },
          { label: 'Pflege & Hygiene', href: '#' },
          { label: 'Therapie & Fitness', href: '#' },
          { label: 'Notruf', href: '#' },
        ],
      },
      {
        title: 'Service',
        links: [
          { label: 'Beratung', href: '#' },
          { label: 'Kostenübernahme', href: '#' },
          { label: 'Lieferung & Aufbau', href: '#' },
          { label: 'Reklamation', href: '#' },
          { label: 'Hilfe-Center', href: '#' },
        ],
      },
      {
        title: 'Unternehmen',
        links: [
          { label: 'Über uns', href: '#' },
          { label: 'Karriere', href: '#' },
          { label: 'Presse', href: '#' },
          { label: 'Nachhaltigkeit', href: '#' },
          { label: 'Partner', href: '#' },
        ],
      },
    ],
    copyright: '© 2026 Prosozial GmbH · Alle Rechte vorbehalten',
    legal: [
      { label: 'Impressum', href: '#' },
      { label: 'Datenschutz', href: '#' },
      { label: 'AGB', href: '#' },
    ],
  },
};
