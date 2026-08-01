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
