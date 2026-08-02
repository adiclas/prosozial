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
      { label: 'Bewertungen',  href: '#bewertungen' },
      { label: 'Kontakt',      href: '#kontakt' },
      { label: 'Seminare',     href: '/seminars' },
      { label: 'Unser Beitrag', href: '/unserbeitrag' },
      { label: 'Verantwortung', href: '/verantwortung' },
      { label: 'Über uns',     href: '/ueber-uns' },
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
    // Real prosozial TV video IDs (first 6 of 31), pulled from the public
    // Invidious playlist API. The admin can add/remove any of the 31 via
    // /admin → Videos → YouTube-Playlist → Video-IDs.
    videoIds: [
      'ehP_2yoCyxo', // Ausbildung und Spaß bei prosozial!
      'scclA6RDcsw', // BFW-Hausmesse 2025 – prosozial mittendrin …
      'zJL-JWnbGmo', // Koblenz, du warst der Hammer! Azubispot …
      '3HzXqF-wj0k', // Zurück auf der JOBNOX 2025 …
      'xyCrQFBA1EA', // Tag 10 der Einführungswochen …
      '6PHW5bEqPDA', // Tag 6 der Einführungswochen …
    ],
  },
  seminarsHeader: {
    eyebrow: 'Wissen & Praxis',
    title: 'Seminare & Schulungen',
    text: 'Lernen Sie von Expert:innen — kompakte Seminare zu allen Themen rund um Pflege, Hilfsmittel und butler-Finanzverwaltung.',
  },
  seminars: {
    header: {
      eyebrow: 'Seminare',
      title: 'Aktuelle Schulungen & Termine',
      text: 'Wählen Sie ein Seminar aus der Liste, um Details, Termine und Inhalte zu sehen.',
    },
    seminars: [
      {
        id: 'butler-finanztraining',
        title: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten',
        status: 'fully-booked',
        provider: 'butler – Customer Support',
        location: 'prosozial GmbH',
        supplierLocation: '56112 Lahnstein, Koblenzer Straße 34 A',
        cost: '298,00 € tax excl.',
        description:
          'In diesem zweitägigen Kurs lernen Sie, butlers Werkzeuge zur Vermögensverwaltung in der Praxis effizient einzusetzen — von der Anlage neuer Konten bis zur Kommunikation mit Banken und Gläubigern.',
        bullets: [
          'Maintain accounts and the associated postings',
          'Find and resolve any balance discrepancies that may have arisen',
          'Fully map the finances of your patients',
          'Conduct correspondence with banks and creditors',
          'Assign the "laundry basket" of receipts to accounting in butler tidy',
          'Set up and operate',
        ],
        dates: [
          {
            date: 'Donnerstag, 06. August 2026',
            label: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten',
            sessions: [
              { time: '10:00 – 12:30', title: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten' },
              { time: '12:30 – 13:30', title: 'Mittagspause' },
              { time: '10:00 – 12:30', title: 'butler Finanztraining: Vermögen und Schulden Ihrer Patienten' },
            ],
          },
          {
            date: 'Freitag, 07. August 2026',
            label: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten',
            sessions: [
              { time: '09:00 – 12:30', title: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten' },
              { time: '12:30 – 13:30', title: 'Mittagspause' },
              { time: '13:30 – 16:00', title: 'butler Finanztraining: Vermögen und Schulden Ihrer Betreuten' },
            ],
          },
        ],
        lecturerIds: ['silke-gehrmann'],
        documents: [
          { label: 'Anreiseübersicht.pdf', url: '/assets/seminars/anreiseuebersicht.pdf' },
        ],
      },
      {
        id: 'pflegekasse-update-2026',
        title: 'Pflegekasse-Update 2026: Neue Regeln & Anträge',
        status: 'few-seats',
        provider: 'prosozial – Akademie',
        location: 'prosozial GmbH, Seminarraum 2',
        supplierLocation: '56112 Lahnstein, Koblenzer Straße 34 A',
        cost: '149,00 € tax incl.',
        description:
          'Was hat sich 2026 bei Pflegekasse und Hilfsmittelverordnung geändert? Ein kompakter Vormittag mit den wichtigsten Änderungen, Praxisbeispielen und Zeit für Ihre Fragen.',
        bullets: [
          'Überblick über die Änderungen 2026',
          'Auswirkungen auf laufende Anträge',
          'Häufige Ablehnungsgründe und wie Sie darauf reagieren',
          'Live: Ausfüllen eines Musterantrags',
        ],
        dates: [
          {
            date: 'Mittwoch, 16. September 2026',
            sessions: [
              { time: '09:00 – 12:00', title: 'Pflegekasse-Update 2026' },
              { time: '12:00 – 13:00', title: 'Mittagspause' },
              { time: '13:00 – 15:00', title: 'Praxis-Workshop: Anträge ausfüllen' },
            ],
          },
        ],
        lecturerIds: ['klaus-werner'],
        documents: [],
      },
    ],
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

  unserBeitrag: {
    eyebrow: 'Unser Beitrag',
    title: 'Was wir für Sie und unsere Region tun',
    lead: 'Nachhaltigkeit, faire Arbeit und regionale Verantwortung — entdecken Sie, wie prosozial jeden Tag einen Unterschied macht.',
    intro: 'Als Hilfsmittel-Anbieter sehen wir uns in einer besonderen Verantwortung — gegenüber unseren Kund:innen, unseren Mitarbeitenden und der Region, in der wir leben. Seit der Gründung verfolgen wir das Ziel, Hilfsmittel nicht nur zugänglich, sondern auch fair, sicher und nachhaltig zu gestalten. Jedes Produkt, jede Beratung und jeder Auslieferung ist ein Beitrag zu mehr Selbstbestimmung und Lebensqualität.',
    items: [
      {
        icon: 'shield-check',
        title: 'Geprüfte Qualität',
        text: 'Alle Produkte werden nach deutschen und europäischen Sicherheitsstandards geprüft — TÜV, CE und ISO 13485 sind für uns selbstverständlich.',
        stat: '100%',
        statLabel: 'TÜV-geprüft',
      },
      {
        icon: 'heart-pulse',
        title: 'Pflege & Beratung',
        text: 'Persönliche Beratung auf Augenhöhe — telefonisch, per Video oder bei Ihnen vor Ort. Wir nehmen uns Zeit für Ihre Situation.',
        stat: '4,9/5',
        statLabel: 'Kundenbewertung',
      },
      {
        icon: 'truck',
        title: 'Schnelle Lieferung',
        text: 'Lagernde Artikel sind innerhalb von 24 Stunden bei Ihnen. Auf Wunsch liefern wir direkt zu Ihnen nach Hause und kümmern uns um die Abrechnung mit der Krankenkasse.',
        stat: '24h',
        statLabel: 'Lieferzeit',
      },
      {
        icon: 'award',
        title: 'Faire Arbeit',
        text: 'Wir investieren in die Ausbildung unserer Mitarbeitenden — mit Schulungen, Zertifizierungen und einem respektvollen, teamorientierten Arbeitsumfeld.',
        stat: '50+',
        statLabel: 'Mitarbeitende',
      },
      {
        icon: 'globe',
        title: 'Regionale Verantwortung',
        text: 'Als Unternehmen mit Sitz in Lahnstein setzen wir auf lokale Wertschöpfung, faire Lieferketten und langfristige Partnerschaften in der Region.',
        stat: 'Seit 2008',
        statLabel: 'in Deutschland',
      },
      {
        icon: 'heart',
        title: 'Persönliche Begleitung',
        text: 'Wir lassen Sie nicht allein — von der ersten Beratung über die Auswahl bis zur Abrechnung mit Ihrer Pflegekasse stehen wir Ihnen zur Seite.',
        stat: '1:1',
        statLabel: 'Beratung',
      },
    ],
    ctaEyebrow: 'Mitmachen',
    ctaTitle: 'Gestalten Sie unseren Beitrag mit',
    ctaText: 'Ob als Kund:in, Partner oder Mitarbeitende:r — gemeinsam können wir viel bewegen. Sprechen Sie uns an oder bewerben Sie sich.',
    ctaLabel: 'Jetzt Kontakt aufnehmen',
    ctaHref: '/login',
  },

  responsibility: {
    eyebrow: 'Verantwortung',
    title: 'Nachhaltigkeit, die wir jeden Tag leben',
    lead: 'Wie wir Verantwortung für Menschen, Region und Umwelt in konkretes Handeln übersetzen — von der Lieferkette bis zur Auslieferung.',
    feature: {
      category: 'Im Fokus',
      title: 'Unser Weg zu mehr Nachhaltigkeit',
      excerpt: 'Wir verbinden Hilfsmittel-Versorgung mit echtem Engagement: klimaschonende Logistik, faire Arbeitsbedingungen und transparente Lieferketten. Ein Überblick über unsere laufenden Projekte und Ziele.',
      href: '/unserbeitrag',
      meta: 'prosozial · Aktualisiert',
    },
    gridTitle: 'Weitere Themen',
    articles: [
      {
        category: 'Umwelt',
        title: 'Klimaschonende Auslieferung',
        excerpt: 'Wir bündeln Lieferungen, setzen auf elektrische Fahrzeuge und kompensieren verbleibende Emissionen — für eine grüne Lieferkette.',
        href: '/unserbeitrag',
        meta: 'Logistik · 4 Min Lesezeit',
      },
      {
        category: 'Soziales',
        title: 'Ausbildung mit Perspektive',
        excerpt: 'Über 50 Mitarbeitende, kontinuierliche Weiterbildung und ein Arbeitsumfeld, in dem jede:r wachsen kann — das ist unser Anspruch.',
        href: '/unserbeitrag',
        meta: 'HR · Team',
      },
      {
        category: 'Lieferkette',
        title: 'Geprüfte Qualität, faire Produktion',
        excerpt: 'TÜV, CE und ISO 13485 sind Standard. Darüber hinaus prüfen wir auch die Arbeitsbedingungen entlang unserer Lieferketten.',
        href: '/unserbeitrag',
        meta: 'Qualität · Standards',
      },
      {
        category: 'Region',
        title: 'Verankert in Lahnstein',
        excerpt: 'Seit 2008 arbeiten wir mit regionalen Partnern, Bildungsträgern und Pflegeeinrichtungen in Rheinland-Pfalz zusammen.',
        href: '/unserbeitrag',
        meta: 'Standort · 56112 Lahnstein',
      },
    ],
  },

  aboutUs: {
    eyebrow: 'Über uns',
    title: 'Wer hinter prosozial steht',
    lead: 'Lernen Sie das Team, die Geschichte und die Werte kennen, die prosozial seit 2008 zu einem verlässlichen Partner für Hilfsmittel und Pflege-Beratung machen.',
    heroCategory: 'Über prosozial',
    heroTitle: 'Hilfsmittel mit Haltung',
    heroExcerpt: 'Seit der Gründung 2008 in Lahnstein verfolgen wir ein Ziel: Menschen mit Hilfsmitteln zu versorgen, die echte Lebensqualität schaffen — fair, transparent und persönlich. Was als kleines Team in Rheinland-Pfalz begann, ist heute ein bundesweit tätiges Hilfsmittel-Unternehmen mit über 50 Mitarbeitenden.',
    heroImage: '',
    heroCtaLabel: 'Kontakt aufnehmen',
    heroCtaHref: '/login',
    storyHeading: 'Unsere Geschichte in Etappen',
    stories: [
      {
        category: 'Seit 2008',
        title: 'Aus der Region für die Region',
        text: 'Was im Jahr 2008 mit drei Mitarbeitenden und einer Vision begann, ist heute ein etabliertes Unternehmen mit Sitz in Lahnstein, Rheinland-Pfalz. Trotz Wachstum sind wir unseren regionalen Wurzeln treu geblieben: Wir arbeiten mit lokalen Partnern, Bildungsträgern und Pflegeeinrichtungen zusammen, um die Versorgung in der Region nachhaltig zu verbessern.\n\nHeute betreuen wir mehrere tausend Kund:innen in ganz Deutschland — von der ersten Beratung über die Lieferung bis zur Abrechnung mit der Pflegekasse.',
        imageSide: 'right',
        ctaLabel: 'Mehr zu unserem Team',
        ctaHref: '/seminars/lecturers',
      },
      {
        category: 'Unser Anspruch',
        title: 'Qualität, die messbar ist',
        text: 'Bei prosozial durchläuft jedes Produkt einen strengen Qualitätsprozess. Wir arbeiten ausschließlich mit Herstellern zusammen, die nach deutschen und europäischen Standards zertifiziert sind — von TÜV über CE bis ISO 13485. Wo immer möglich, prüfen wir auch die Produktionsbedingungen entlang der Lieferkette.\n\nDarüber hinaus investieren wir kontinuierlich in Schulungen unserer Mitarbeitenden, damit jede Beratung auf dem neuesten Stand von Pflege, Technik und Recht erfolgt.',
        imageSide: 'left',
        ctaLabel: 'Zertifikate ansehen',
        ctaHref: '/seminars',
      },
      {
        category: 'Unsere Haltung',
        title: 'Persönlich statt anonym',
        text: 'Hinter jeder Bestellung steht ein Mensch mit einer ganz persönlichen Geschichte. Deshalb glauben wir an Beratung, die zuhört — am Telefon, per Video oder bei Ihnen vor Ort. Wir nehmen uns Zeit für Ihre Situation, empfehlen nur Produkte, die wirklich passen, und kümmern uns um die gesamte Abwicklung mit Ihrer Pflegekasse.\n\nDiese Haltung spiegelt sich auch in unserem Team wider: Viele unserer Mitarbeitenden sind seit Jahren bei uns, bilden sich regelmäßig weiter und kennen die Herausforderungen im Pflege-Alltag aus eigener Erfahrung.',
        imageSide: 'right',
        ctaLabel: 'Lernen Sie unser Team kennen',
        ctaHref: '/seminars/lecturers',
      },
    ],
    statsHeading: 'prosozial in Zahlen',
    stats: [
      { value: 'Seit 2008', label: 'in Deutschland' },
      { value: '50+',        label: 'Mitarbeitende' },
      { value: '4,9 / 5',    label: 'Kundenbewertung' },
      { value: '24h',       label: 'Lieferzeit' },
      { value: '320+',      label: 'Produkte' },
    ],
    ctaEyebrow: 'Kontakt',
    ctaTitle: 'Sprechen Sie uns an',
    ctaText: 'Ob als Kund:in, Partner oder zukünftige:r Mitarbeitende:r — wir freuen uns auf den Austausch mit Ihnen.',
    ctaLabel: 'Jetzt Kontakt aufnehmen',
    ctaHref: '/login',
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

  // ============================================================
  // Global lecturer pool — managed at /seminars/lecturers.
  // Seeded with the three consulting-team members so the public
  // homepage still has a populated "Beratungsteam" section.
  // ============================================================
  lecturers: [
    {
      id: 'silke-gehrmann',
      name: 'Silke Gehrmann',
      role: 'Trainerin · butler Customer Support',
      avatarColor: '#007F41',
      expertise: ['butler', 'Finanzverwaltung', 'Schulungen'],
      order: 1,
    },
    {
      id: 'klaus-werner',
      name: 'Klaus Werner',
      role: 'Pflegedienstleiter & Dozent',
      avatarColor: '#0f172a',
      expertise: ['Pflegekasse', 'Hilfsmittelverordnung'],
      order: 2,
    },
    {
      id: 'anna-vogt',
      name: 'Anna Vogt',
      role: 'Hilfsmittel-Beraterin',
      avatarColor: '#9ed4ad',
      expertise: ['Mobilität', 'Alltagshilfen', 'Beratung'],
      order: 3,
    },
    {
      id: 'markus-lehner',
      name: 'Markus Lehner',
      role: 'Pflege-Spezialist',
      avatarColor: '#74c189',
      expertise: ['Demenz', 'Häusliche Pflege'],
      order: 4,
    },
    {
      id: 'sophia-bach',
      name: 'Sophia Bach',
      role: 'Ergotherapeutin',
      avatarColor: '#4daf6a',
      expertise: ['Therapie', 'Rehabilitation'],
      order: 5,
    },
  ],
};
