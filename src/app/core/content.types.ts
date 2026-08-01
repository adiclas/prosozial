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

export interface SectionHeader {
  eyebrow: string;
  title: string;
  text: string;
}

export interface HeaderContent {
  brand: string;
  navLinks: { label: string; href: string }[];
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
  footer: FooterContent;
}
