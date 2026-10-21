export interface BaseItem {
  id: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  siteName: string;
  shortName: string;
  urduName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  overview: string;
  causeTitle: string;
  causeText: string;
  causeQuote: string;
  causeQuoteSource: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  facebook: string;
  twitter: string;
  youtube: string;
  footerNote: string;
  jobsUrl: string;
  tendersUrl: string;
}

export interface HeroItem extends BaseItem { title: string; image: string }
export interface Leader extends BaseItem { name: string; role: string; bio: string; image: string; link: string }
export interface Slide extends BaseItem { title: string; image: string; link: string }
export interface GlanceItem extends BaseItem { title: string; text: string; image: string; accent: string }
export interface Stat extends BaseItem { value: string; unit: string; label: string; note: string }
export interface TimelineItem extends BaseItem { year: string; title: string; text: string }
export interface DayItem extends BaseItem { date: string; title: string; text: string }
export interface NewsItem extends BaseItem {
  slug: string;
  title: string;
  date: string;
  image: string;
  body: string;
  published: boolean;
  featured: boolean;
}
export interface VideoItem extends BaseItem { title: string; url: string; description: string }
export interface Department extends BaseItem { name: string; url: string; category: string; logo: string; featured: boolean }
export interface Helpline extends BaseItem { category: string; group: string; designation: string; number: string }
export interface PageItem extends BaseItem {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  body: string;
  source: string;
}
export interface Message extends BaseItem {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
}
export interface MediaItem extends BaseItem {
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
}
export interface AuditEntry {
  id: string;
  at: string;
  user: string;
  action: string;
  target: string;
}

export interface DB {
  settings: Settings;
  hero: HeroItem[];
  leaders: Leader[];
  slides: Slide[];
  glance: GlanceItem[];
  stats: Stat[];
  timeline: TimelineItem[];
  days: DayItem[];
  news: NewsItem[];
  videos: VideoItem[];
  departments: Department[];
  helplines: Helpline[];
  pages: PageItem[];
  messages: Message[];
  media: MediaItem[];
  audit: AuditEntry[];
}

export type Role = "admin" | "editor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
  /** Bumped on password change or "sign out everywhere"; old sessions stop working. */
  sessionVersion?: number;
  /** Base32 secret for two-factor login; empty when 2FA is off. */
  totpSecret?: string;
  lastLoginAt?: string;
}

export type PublicUser = Omit<User, "passwordHash" | "totpSecret"> & { twoFactor: boolean };
