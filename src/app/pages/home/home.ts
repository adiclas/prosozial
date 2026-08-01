import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
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

  readonly mobileNavOpen = signal(false);

  // Reactive signals from the content service — updates flow through
  // automatically when an admin saves in /admin.
  readonly header = this.content.header;
  readonly hero = this.content.hero;
  readonly featuresHeader = this.content.featuresHeader;
  readonly features = this.content.features;
  readonly servicesHeader = this.content.servicesHeader;
  readonly services = this.content.services;
  readonly showcase = this.content.showcase;
  readonly videosHeader = this.content.videosHeader;
  readonly videos = this.content.videos;
  readonly badgesHeader = this.content.badgesHeader;
  readonly badges = this.content.badges;
  readonly guarantee = this.content.guarantee;
  readonly plans = this.content.plans;
  readonly teamTitle = this.content.teamTitle;
  readonly teamText = this.content.teamText;
  readonly team = this.content.team;
  readonly ctaStrip = this.content.ctaStrip;
  readonly footer = this.content.footer;

  // ----- YouTube playlist state -----
  readonly videos$ = signal<YouTubeVideo[]>([]);
  readonly activeVideoId = signal<string | null>(null);
  readonly activeVideo = computed<YouTubeVideo | null>(() => {
    const id = this.activeVideoId();
    return this.videos$().find((v) => v.id === id) ?? this.videos$()[0] ?? null;
  });
  readonly activeEmbedUrl = computed(() => {
    const v = this.activeVideo();
    return v ? `https://www.youtube.com/embed/${v.id}?rel=0` : null;
  });
  readonly playlistEmbedUrl = computed(() => this.youtubeEmbedUrl(this.videos().playlistUrl));
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
    // Scroll the selected item into view in the list
    queueMicrotask(() => {
      document
        .querySelector(`[data-video-id="${id}"]`)
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  stars(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
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

  toggleMobileNav(): void {
    this.mobileNavOpen.update((v) => !v);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }
}
