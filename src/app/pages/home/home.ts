import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Icon } from '../../shared/icon';
import { ContentService } from '../../core/content.service';
import { YouTubeService, YouTubeVideo } from './youtube.service';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly content = inject(ContentService);
  private readonly youtube = inject(YouTubeService);
  private readonly sanitizer = inject(DomSanitizer);

  // Reactive signals from the content service — updates flow through
  // automatically when an admin saves in /admin.
  // Header & footer live in the public-shell wrapper — home only owns
  // its own section content.
  readonly hero = this.content.hero;
  readonly featuresHeader = this.content.featuresHeader;
  readonly features = this.content.features;
  readonly servicesHeader = this.content.servicesHeader;
  readonly services = this.content.services;
  readonly showcase = this.content.showcase;
  readonly videosHeader = this.content.videosHeader;
  readonly videos = this.content.videos;
  readonly seminarsHeader = this.content.seminarsHeader;
  readonly seminars = this.content.seminars;
  readonly badgesHeader = this.content.badgesHeader;
  readonly badges = this.content.badges;
  readonly guarantee = this.content.guarantee;
  readonly plans = this.content.plans;
  readonly lecturers = this.content.lecturers;

  /**
   * Lecturers sorted by `order` (then by name as a tiebreaker). Computed
   * once and shared between the bento rows so we don't re-sort twice.
   * Items missing an `order` get pushed to the bottom (default 999).
   */
  private readonly sortedLecturers = computed(() =>
    [...this.lecturers()].sort((a, b) => {
      const oa = a.order ?? 999;
      const ob = b.order ?? 999;
      return oa - ob || a.name.localeCompare(b.name);
    }),
  );

  /** Top row photos for the bento mosaic — up to 10. */
  readonly topRowLecturers = computed(() => this.sortedLecturers().slice(0, 10));
  /** Bottom row photos — up to 4 (offset, fewer than the top). */
  readonly bottomRowLecturers = computed(() => this.sortedLecturers().slice(10, 14));

  readonly ctaStrip = this.content.ctaStrip;
  readonly unserBeitrag = this.content.unserBeitrag;

  // ----- YouTube playlist state -----
  readonly videos$ = signal<YouTubeVideo[]>([]);
  readonly activeVideoId = signal<string | null>(null);
  readonly playerStarted = signal(false);
  readonly activeVideo = computed<YouTubeVideo | null>(() => {
    const id = this.activeVideoId();
    return this.videos$().find((v) => v.id === id) ?? this.videos$()[0] ?? null;
  });
  /**
   * Embed URL is only computed once the user has explicitly clicked play.
   * Until then, the poster + play button is shown — this avoids the
   * "black iframe" state that YouTube shows by default and also dodges
   * browsers' autoplay policies.
   */
  readonly activeEmbedUrl = computed(() => {
    if (!this.playerStarted()) return null;
    const v = this.activeVideo();
    return v
      ? `https://www.youtube.com/embed/${encodeURIComponent(v.id)}?autoplay=1&mute=1&rel=0&playsinline=1&modestbranding=1`
      : null;
  });
  /**
   * `<iframe [src]>` runs through Angular's resource-URL sanitizer, which
   * blocks the raw string. Wrap it so the binding is allowed.
   */
  readonly safeActiveEmbed = computed<SafeResourceUrl | null>(() => {
    const url = this.activeEmbedUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });
  readonly playlistEmbedUrl = computed(() => this.youtubeEmbedUrl(this.videos().playlistUrl));
  readonly safePlaylistEmbed = computed<SafeResourceUrl | null>(() => {
    const url = this.playlistEmbedUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });
  readonly videoCount = computed(() => this.videos$().length);

  constructor() {
    // Fetch metadata whenever the configured video IDs change.
    effect(() => {
      const ids = this.videos().videoIds ?? [];
      this.youtube.load(ids).then((items) => {
        this.videos$.set(items);
        // Default to the first video if nothing's selected
        if (!this.activeVideoId() && items.length > 0) {
          this.activeVideoId.set(items[0].id);
        }
      });
    });
  }

  selectVideo(id: string): void {
    this.activeVideoId.set(id);
    this.playerStarted.set(true);
    // Scroll the selected item into view in the list
    queueMicrotask(() => {
      document
        .querySelector(`[data-video-id="${id}"]`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  startPlayer(): void {
    this.playerStarted.set(true);
  }

  /**
   * Replace broken YouTube thumbnails (404 because the video was deleted
   * or the ID is wrong) with a neutral inline SVG placeholder. We swap the
   * src once and flag the element so the browser doesn't try to re-fetch
   * on every change-detection pass.
   */
  onThumbError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.dataset['fallback'] === '1') return;
    img.dataset['fallback'] = '1';
    img.src =
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="320" height="180">' +
          '<rect width="320" height="180" fill="#e2e8f0"/>' +
          '<path d="M140 70v40l30-20z" fill="#94a3b8"/>' +
          '<text x="160" y="150" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#64748b">Video nicht verfügbar</text>' +
          '</svg>',
      );
  }

  stars(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }

  lecturerInitials(name: string): string {
    return (name ?? '')
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  /** Format an index as a zero-padded number ("01", "02" …). */
  padNum(n: number): string {
    return n < 10 ? `0${n}` : String(n);
  }

  /** Return the first scheduled date for a seminar, formatted German-style. */
  firstDate(s: any): string {
    const raw = s?.dates?.[0]?.date as string | undefined;
    if (!raw) return 'Termin folgt';
    try {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return raw;
      return d.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return raw;
    }
  }

  /**
   * Convert any YouTube URL (watch?v=…&list=…, /playlist?list=…, or already an
   * /embed/videoseries?list=…) into the canonical embed URL used by the iframe.
   * Returns null for empty/invalid input so the template can render a fallback.
   */
  youtubeEmbedUrl(raw: string): string | null {
    if (!raw) return null;
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      return null;
    }
    if (url.hostname.endsWith('youtube.com') === false && url.hostname !== 'youtu.be') return null;
    const list = url.searchParams.get('list');
    if (!list) return null;
    return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`;
  }
}
