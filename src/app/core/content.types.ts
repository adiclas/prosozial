import { IconName } from '../icons';

export interface CtaLink {
  label: string;
  href: string;
}

export interface TrustItem {
  icon: IconName;
  label: string;
}

export interface AvatarBubble {
  initials: string;
  color: string;
}

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  titleLine2Accent: boolean;
  lead: string;
  ctaPrimary: CtaLink;
  ctaSecondary: CtaLink;
  trustItems: TrustItem[];
  cardTitle: string;
  cardSubtitle: string;
  cardIcon: IconName;
  cardTopText: string;
  ratingScore: string;
  ratingCount: string;
  avatars: AvatarBubble[];
}

export interface FeatureContent {
  title: string;
  description: string;
  icon: IconName;
  highlight: boolean;
  cta: string;
}

export interface ServiceContent {
  title: string;
  description: string;
  icon: IconName;
}

export interface VideosContent {
  /** Full YouTube URL — accepts both the watch URL and the playlist URL. */
  playlistUrl: string;
  /**
   * Video IDs from the playlist, one per line in the admin. Used to render
   * the YouTube-style layout (featured video + list) without a YouTube
   * Data API key. Metadata (title, thumbnail, author) is fetched on the
   * server via the public oEmbed endpoint and cached for a day.
   */
  videoIds: string[];
}

export type SeminarStatus = 'available' | 'few-seats' | 'fully-booked' | 'cancelled';

export interface SeminarSession {
  /** Free-form time range, e.g. "10:00 – 12:30". */
  time: string;
  /** Session title, e.g. "butler Finanztraining: Vermögen und Schulden Ihrer Betreuten". */
  title: string;
}

export interface SeminarDate {
  /** Human-readable date header, e.g. "Freitag, 07. August 2026". */
  date: string;
  /** Optional group label shown under the date header. */
  label?: string;
  /** Time slots for the day. */
  sessions: SeminarSession[];
}

export interface SeminarLecturer {
  name: string;
  role: string;
  avatar?: string;
}

/**
 * A lecturer in the global pool. Managed at /seminars/lecturers and
 * referenced by id from any seminar (seminar.lecturerIds). This avoids
 * duplicating the same person across multiple seminars.
 */
export interface Lecturer {
  /** URL-safe slug, e.g. "anna-vogt". Used as the lookup key. */
  id: string;
  name: string;
  role: string;
  /** Image — data URL (uploaded) or external URL. */
  avatar?: string;
  /** Background color for the initials fallback, e.g. "#4daf6a". */
  avatarColor?: string;
  bio?: string;
  email?: string;
  phone?: string;
  /** Tags shown as small chips on the public card, e.g. ["Pflege", "Demenz"]. */
  expertise?: string[];
  /** Display order (lower = first). */
  order?: number;
}

export interface SeminarDocument {
  label: string;
  url: string;
}

export interface Seminar {
  /** URL slug used for /seminars/:id. Auto-derived from title if empty. */
  id: string;
  title: string;
  status: SeminarStatus;
  provider: string;
  /** Where the seminar takes place (room/building). */
  location: string;
  /** Full address of the supplier/organizer. */
  supplierLocation: string;
  /** Price text, e.g. "298,00 € tax excl." */
  cost: string;
  /** Optional hero image. */
  image?: string;
  /** Plain-text or lightly-formatted description / contents. */
  description: string;
  /** Optional bullet points shown in the contents column. */
  bullets: string[];
  dates: SeminarDate[];
  /** IDs of lecturers from the global pool (see Lecturer / SiteContent.lecturers). */
  lecturerIds: string[];
  documents: SeminarDocument[];
}

export interface SeminarsContent {
  header: SectionHeader;
  seminars: Seminar[];
}

export interface BadgeContent {
  title: string;
  description: string;
  icon: IconName;
}

export interface PlanContent {
  name: string;
  badge: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  variant: 'basic' | 'featured' | 'premium';
}

export interface TeamMemberContent {
  name: string;
  role: string;
  rating: number;
  avatarColor: string;
  initials: string;
}

export interface ShowcaseContent {
  beforeLabel: string;
  beforeTitle: string;
  beforeNote: string;
  afterLabel: string;
  afterTitle: string;
  afterNote: string;
  step1Title: string;
  step1Text: string;
  step2Title: string;
  step2Text: string;
  step3Title: string;
  step3Text: string;
}

export interface GuaranteeContent {
  title: string;
  text: string;
  items: string[];
  sealIcon: IconName;
}

export interface CtaStripContent {
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  phoneLabel: string;
  phoneHref: string;
}

/**
 * One contribution area on the "Unser Beitrag" page. Each card explains
 * one way prosozial makes a positive impact — sustainable products, fair
 * jobs, regional partnerships, etc. A stat can highlight the impact with
 * a number (e.g. "320+ Produkte auf Lager" or "1.240 Bewertungen").
 */
export interface BeitragItem {
  icon: IconName;
  title: string;
  text: string;
  /** Optional big-number stat shown alongside the card. */
  stat?: string;
  /** Optional caption beneath the stat. */
  statLabel?: string;
}

/**
 * Full content of the "Unser Beitrag" (Our Contribution) page — a
 * sustainability / CSR section highlighting prosozial's impact across
 * product, social, and regional dimensions. Inspired by the public
 * /unserbeitrag page at prosozial.de.
 */
export interface UnserBeitragContent {
  eyebrow: string;
  title: string;
  lead: string;
  /** Long-form intro paragraph shown at the top of the public page. */
  intro: string;
  /** Individual contribution areas. */
  items: BeitragItem[];
  /** Bottom-of-page call-to-action. */
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * One supporting article in the "Responsibility" (Verantwortung /
 * Nachhaltigkeit) grid. Inspired by the 4-column blog list on
 * /nachhaltigkeit at prosozial.de.
 */
export interface ResponsibilityArticle {
  /** Category label (e.g. "Umwelt", "Soziales", "Lieferkette"). */
  category: string;
  /** Headline shown on the card. */
  title: string;
  /** One-sentence excerpt. */
  excerpt: string;
  /** Optional image URL or data URI for the article thumbnail. */
  image?: string;
  /** Where the card links (defaults to /seminars or external URL). */
  href: string;
  /** Author / date stamp shown in small text under the title. */
  meta?: string;
}

/**
 * Full content of the "Verantwortung" / "Responsibility" page —
 * mirrors prosozial.de/nachhaltigkeit with a hero feature article and
 * a 4-column grid of related articles.
 */
export interface ResponsibilityContent {
  eyebrow: string;
  title: string;
  lead: string;
  /** Featured article shown at the top (hero). */
  feature: ResponsibilityArticle;
  /** Heading for the related-articles grid. */
  gridTitle: string;
  /** Up to 4 supporting articles. */
  articles: ResponsibilityArticle[];
}

/**
 * One image+text story block on the "Über uns" (About Us) page —
 * mirrors the `<blog template="bild-neben-text">` widgets on
 * prosozial.de/ueber-uns. Admins can alternate `imageSide` to make
 * the layout zig-zag down the page.
 */
export interface AboutStoryBlock {
  /** Small category / eyebrow label. */
  category: string;
  /** Headline for this section. */
  title: string;
  /** Body copy (one or two paragraphs). */
  text: string;
  /** Optional image. Falls back to a branded placeholder. */
  image?: string;
  /** Which side the image sits on. */
  imageSide: 'left' | 'right';
  /** Optional CTA link + label. */
  ctaLabel?: string;
  ctaHref?: string;
}

/** One stat in the "Über uns" stat strip (e.g. "Seit 2008"). */
export interface AboutStat {
  /** Big number / phrase, e.g. "2008" or "24h". */
  value: string;
  /** Caption beneath the value. */
  label: string;
}

/**
 * Full content of the "Über uns" (About Us) page — mirrors the
 * card+story layout of prosozial.de/ueber-uns: a hero card, two or
 * more image+text story blocks, a stat strip, and a closing CTA.
 */
export interface AboutUsContent {
  eyebrow: string;
  title: string;
  lead: string;
  /** Hero card — full-bleed with image, category, title, excerpt, CTA. */
  heroCategory: string;
  heroTitle: string;
  heroExcerpt: string;
  heroImage?: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  /** Heading above the story blocks. */
  storyHeading: string;
  /** Alternating image+text story blocks. */
  stories: AboutStoryBlock[];
  /** Heading above the stat strip. */
  statsHeading: string;
  /** Stats shown in a horizontal strip. */
  stats: AboutStat[];
  /** Bottom CTA. */
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface SectionHeader {
  eyebrow: string;
  title: string;
  text: string;
}

/**
 * One entry in the public-site primary navigation. A nav item is either
 * a leaf (with an `href` pointing to a page or anchor) or a parent that
 * groups child links under a dropdown.
 */
export interface NavLink {
  label: string;
  /** Required for leaves; optional for parents that only group children. */
  href?: string;
  /** Child links rendered as a dropdown under this entry. */
  children?: NavLink[];
}

export interface HeaderContent {
  brand: string;
  navLinks: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}

export interface FooterContent {
  brand: string;
  description: string;
  contact: { icon: IconName; text: string }[];
  columns: { title: string; links: { label: string; href: string }[] }[];
  copyright: string;
  legal: { label: string; href: string }[];
}

export interface SiteContent {
  header: HeaderContent;
  hero: HeroContent;
  featuresHeader: SectionHeader;
  features: FeatureContent[];
  servicesHeader: SectionHeader;
  services: ServiceContent[];
  showcase: ShowcaseContent;
  videosHeader: SectionHeader;
  videos: VideosContent;
  seminarsHeader: SectionHeader;
  seminars: SeminarsContent;
  /** Global lecturer pool — managed at /seminars/lecturers. */
  lecturers: Lecturer[];
  badgesHeader: SectionHeader;
  badges: BadgeContent[];
  guarantee: GuaranteeContent;
  plans: PlanContent[];
  teamTitle: string;
  teamText: string;
  team: TeamMemberContent[];
  ctaStrip: CtaStripContent;
  /** "Unser Beitrag" (Our Contribution) sustainability / CSR section. */
  unserBeitrag: UnserBeitragContent;
  /** "Verantwortung" / "Responsibility" page — mirrors prosozial.de/nachhaltigkeit. */
  responsibility: ResponsibilityContent;
  /** "Über uns" (About Us) page — mirrors prosozial.de/ueber-uns. */
  aboutUs: AboutUsContent;
  footer: FooterContent;
}
