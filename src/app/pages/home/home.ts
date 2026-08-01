import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon';
import { IconName } from '../../icons';

interface Feature {
  title: string;
  description: string;
  icon: IconName;
  highlight?: boolean;
  cta: string;
}

interface Service {
  title: string;
  description: string;
  icon: IconName;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

interface Badge {
  title: string;
  description: string;
  icon: IconName;
}

interface Plan {
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  variant: 'basic' | 'featured' | 'premium';
}

interface TeamMember {
  name: string;
  role: string;
  rating: number;
  avatarColor: string;
  initials: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly mobileNavOpen = signal(false);

  readonly navLinks = [
    { label: 'Produkte', href: '#produkte' },
    { label: 'Über uns', href: '#ueber-uns' },
    { label: 'Ablauf', href: '#ablauf' },
    { label: 'Für Pflegeeinrichtungen', href: '#b2b' },
    { label: 'Bewertungen', href: '#bewertungen' },
    { label: 'Kontakt', href: '#kontakt' },
  ] as const;

  readonly features: Feature[] = [
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
      cta: 'Mehr erfahren',
    },
    {
      title: 'Pflege & Hygiene',
      description: 'Professionelle Produkte für die häusliche und stationäre Pflege.',
      icon: 'heart-pulse',
      cta: 'Auswahl entdecken',
    },
  ];

  readonly services: Service[] = [
    {
      title: 'Rollstühle & Rollatoren',
      description: 'Leicht, faltbar und individuell anpassbar — für mehr Bewegungsfreiheit.',
      icon: 'wheelchair',
    },
    {
      title: 'Bad & WC Sicherheit',
      description: 'Haltegriffe, Duschsitze und Toilettensitzerhöhungen für sicheren Alltag.',
      icon: 'shower',
    },
    {
      title: 'Bett & Schlafen',
      description: 'Pflegebetten, Matratzen und Lagerungshilfen für erholsamen Schlaf.',
      icon: 'bed',
    },
    {
      title: 'Therapie & Fitness',
      description: 'Trainingsgeräte und Bewegungshilfen für Reha und Prävention.',
      icon: 'dumbbell',
    },
    {
      title: 'Notruf & Sicherheit',
      description: 'Hausnotruf und Sturzsensoren — schnelle Hilfe auf Knopfdruck.',
      icon: 'sos',
    },
    {
      title: 'Haushaltshilfen',
      description: 'Greifhilfen, Öffner und Alltagshelfer für mehr Selbstständigkeit.',
      icon: 'home',
    },
  ];

  readonly testimonials: Testimonial[] = [
    {
      name: 'Sabine Förster',
      role: 'Angehörige · München',
      text: '„Die Beratung war unglaublich geduldig. Mein Vater hat seinen neuen Rollator vom ersten Tag an geliebt — die Lieferung kam in 24 Stunden."',
      rating: 5,
      avatar: 'S',
    },
    {
      name: 'Dr. Klaus Werner',
      role: 'Pflegedienstleiter',
      text: '„Wir statten drei Wohngruppen mit Prosozial aus. Top Qualität, faire Konditionen und ein Team, das Pflege wirklich versteht."',
      rating: 5,
      avatar: 'K',
    },
    {
      name: 'Maria Hellbach',
      role: 'Kundin · Köln',
      text: '„Endlich ein Anbieter, der die Hilfsmittel-Verordnung ernst nimmt. Reibungsloser Ablauf mit meiner Krankenkasse."',
      rating: 5,
      avatar: 'M',
    },
  ];

  readonly badges: Badge[] = [
    {
      title: 'TÜV geprüft',
      description: 'Alle Produkte werden nach deutschen Sicherheitsstandards geprüft.',
      icon: 'shield-check',
    },
    {
      title: 'CE-zertifiziert',
      description: 'Medizinprodukte mit vollständiger EU-Konformität.',
      icon: 'certificate',
    },
    {
      title: 'ISO 13485',
      description: 'Zertifiziertes Qualitätsmanagement für Medizinprodukte.',
      icon: 'award',
    },
    {
      title: 'DSGVO-konform',
      description: 'Ihre Daten werden ausschließlich in der EU verarbeitet.',
      icon: 'lock',
    },
    {
      title: 'Lieferung in 24h',
      description: 'Lagernde Artikel noch am selben Tag auf dem Weg zu Ihnen.',
      icon: 'truck',
    },
    {
      title: 'Faire Preise',
      description: 'Direkt vom Hersteller — ohne teure Zwischenhändler.',
      icon: 'badge-leaf',
    },
  ];

  readonly plans: Plan[] = [
    {
      name: 'Beratung',
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
  ];

  readonly team: TeamMember[] = [
    {
      name: 'Anna Vogt',
      role: 'Hilfsmittel-Beraterin',
      rating: 5,
      avatarColor: '#9ed4ad',
      initials: 'AV',
    },
    {
      name: 'Markus Lehner',
      role: 'Pflege-Spezialist',
      rating: 5,
      avatarColor: '#74c189',
      initials: 'ML',
    },
    {
      name: 'Sophia Bach',
      role: 'Ergotherapeutin',
      rating: 5,
      avatarColor: '#4daf6a',
      initials: 'SB',
    },
  ];

  readonly showcaseBefore = {
    title: 'Vorher',
    label: 'Ohne Beratung',
    note: 'Ungeeignetes Hilfsmittel, hohe Sturzgefahr',
  };

  readonly showcaseAfter = {
    title: 'Nachher',
    label: 'Mit Prosozial',
    note: 'Passende Lösung, mehr Selbstständigkeit',
  };

  toggleMobileNav(): void {
    this.mobileNavOpen.update((v) => !v);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  stars(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }
}
