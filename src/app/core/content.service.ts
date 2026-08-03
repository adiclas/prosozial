import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_CONTENT } from './content-defaults';
import { SiteContent } from './content.types';

const STORAGE_KEY = 'prosozial.content.v2';
const API = '/api/content';

/**
 * Source of truth for every editable string/array on the public site.
 *
 * Storage layers, in order of freshness:
 *   1. API   (server/content.json via the dev mock backend)  ← canonical
 *   2. localStorage                                            ← offline cache
 *   3. DEFAULT_CONTENT                                         ← shipped seed
 *
 * On construction we hydrate from localStorage for instant render, then
 * fetch the API in the background. When the API responds, its data
 * overwrites the in-memory state and is cached back to localStorage.
 *
 * save() PUTs to the API first; only if that succeeds do we update the
 * signal and localStorage. That way two browsers always converge.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  private readonly _content = signal<SiteContent>(this.hydrate());
  private readonly _status = signal<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');
  private readonly _error = signal<string | null>(null);
  private readonly _lastSyncedAt = signal<number | null>(null);
  /**
   * True while the /api/content backend answered with real JSON. On static
   * hosts (e.g. Vercel without a serverless function) the SPA's index.html
   * answers every route with status 200, so we detect the HTML body and mark
   * the backend as offline — saves still persist in localStorage, they just
   * don't sync across browsers.
   */
  private readonly _backendConnected = signal(true);

  readonly content = this._content.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly lastSyncedAt = this._lastSyncedAt.asReadonly();
  readonly backendConnected = this._backendConnected.asReadonly();

  readonly header = computed(() => this._content().header);
  readonly hero = computed(() => this._content().hero);
  readonly featuresHeader = computed(() => this._content().featuresHeader);
  readonly features = computed(() => this._content().features);
  readonly servicesHeader = computed(() => this._content().servicesHeader);
  readonly services = computed(() => this._content().services);
  readonly showcase = computed(() => this._content().showcase);
  readonly videosHeader = computed(() => this._content().videosHeader);
  readonly videos = computed(() => this._content().videos);
  readonly seminarsHeader = computed(() => this._content().seminarsHeader);
  readonly seminars = computed(() => this._content().seminars);
  readonly lecturers = computed(() => this._content().lecturers ?? []);
  readonly badgesHeader = computed(() => this._content().badgesHeader);
  readonly badges = computed(() => this._content().badges);
  readonly guarantee = computed(() => this._content().guarantee);
  readonly plans = computed(() => this._content().plans);
  readonly teamTitle = computed(() => this._content().teamTitle);
  readonly teamText = computed(() => this._content().teamText);
  readonly team = computed(() => this._content().team);
  readonly ctaStrip = computed(() => this._content().ctaStrip);
  readonly unserBeitrag = computed(() => this._content().unserBeitrag);
  readonly responsibility = computed(() => this._content().responsibility);
  readonly aboutUs = computed(() => this._content().aboutUs);
  readonly wirsuchensie = computed(() => this._content().wirsuchensie);
  readonly weltfair = computed(() => this._content().weltfair);
  readonly footer = computed(() => this._content().footer);

  constructor() {
    this.refresh();
  }

  /** Pull the latest content from the server (overrides local cache on success). */
  async refresh(): Promise<void> {
    this._status.set('loading');
    this._error.set(null);
    try {
      // Read as text so a 200-but-HTML response (static host fallback) doesn't
      // throw a JSON parse error — we can inspect the body instead.
      const body = await firstValueFrom(this.http.get(API, { responseType: 'text' }));
      if (!this.looksLikeJson(body)) {
        // The host answered with HTML — there is no real backend here.
        this._backendConnected.set(false);
        this._status.set('idle');
        return;
      }
      const remote = JSON.parse(body) as SiteContent;
      const merged = this.merge(remote);
      this._backendConnected.set(true);
      this._content.set(merged);
      this.writeLocal(merged);
      this._lastSyncedAt.set(Date.now());
      this._status.set('idle');
    } catch (err: any) {
      // Backend not running or network error — keep the local cache and continue.
      this._backendConnected.set(false);
      this._error.set(this.formatError(err));
      this._status.set('error');
    }
  }

  /** Persist to the server; falls back to local-only if the API is unreachable. */
  async save(next: SiteContent): Promise<{ ok: boolean; error?: string; localOnly?: boolean }> {
    this._status.set('saving');
    this._error.set(null);
    // Snapshot the current state so we can roll back if the server rejects
    // the save. Without this, a failed PUT would leave the local signal +
    // localStorage out of sync with the server — and the next refresh()
    // would silently wipe the change from the user's view.
    const previous = this._content();
    try {
      // Optimistic local update so the UI feels instant.
      this._content.set(next);
      this.writeLocal(next);
      const body = await firstValueFrom(this.http.put(API, next, { responseType: 'text' }));
      if (!this.looksLikeJson(body)) {
        // No real backend (static host returned the SPA shell). The content is
        // already safely persisted to localStorage — report success as
        // local-only rather than a hard failure.
        this._backendConnected.set(false);
        this._lastSyncedAt.set(Date.now());
        this._status.set('saved');
        setTimeout(() => {
          if (this._status() === 'saved') this._status.set('idle');
        }, 2000);
        return { ok: true, localOnly: true };
      }
      this._backendConnected.set(true);
      this._lastSyncedAt.set(Date.now());
      this._status.set('saved');
      // Drop back to idle after a moment so the badge can fade out
      setTimeout(() => {
        if (this._status() === 'saved') this._status.set('idle');
      }, 2000);
      return { ok: true };
    } catch (err: any) {
      // Roll back to the previous state so the UI doesn't pretend the save
      // succeeded when the server didn't accept it.
      this._content.set(previous);
      this.writeLocal(previous);
      this._backendConnected.set(false);
      this._error.set(this.formatError(err));
      this._status.set('error');
      return { ok: false, error: this._error() ?? 'Save failed' };
    }
  }

  async reset(): Promise<void> {
    const fresh = structuredClone(DEFAULT_CONTENT);
    const res = await this.save(fresh);
    if (res.ok) this._content.set(fresh);
  }

  update<K extends keyof SiteContent>(key: K, value: SiteContent[K]): void {
    this.save({ ...this._content(), [key]: value });
  }

  /** Acknowledge the last save error without retrying. Used by the admin
   *  panel's dismissable error banner. */
  clearError(): void {
    this._error.set(null);
    if (this._status() === 'error') this._status.set('idle');
  }

  private merge(remote: unknown): SiteContent {
    const base = structuredClone(DEFAULT_CONTENT);
    if (!remote || typeof remote !== 'object') return base;
    const r = remote as Partial<SiteContent>;
    const merged: SiteContent = { ...base, ...r };

    // Defensive: every array-shaped field must end up as an array. If the
    // upstream source (form shape mismatch, partial PUT, corrupted localStorage)
    // turns one into an object/null, fall back to the default value.
    merged.features = Array.isArray(r.features) ? r.features : base.features;
    merged.services = Array.isArray(r.services) ? r.services : base.services;
    merged.badges = Array.isArray(r.badges) ? r.badges : base.badges;
    merged.lecturers = Array.isArray((r as any).lecturers) ? (r as any).lecturers : base.lecturers;
    merged.plans = Array.isArray(r.plans) ? r.plans : base.plans;
    merged.team = Array.isArray(r.team) ? r.team : base.team;

    // Nested arrays
    merged.header = {
      ...base.header,
      ...(r.header ?? {}),
      // Preserve each nav entry's children array verbatim so sub-links
      // added via the admin (Lecturers under Seminare, etc.) survive the
      // remote-to-local round-trip. Fall back to the bundled defaults
      // only when the remote payload is missing the array entirely.
      navLinks: Array.isArray(r.header?.navLinks)
        ? r.header!.navLinks!.map((l: any) => ({
            label: l.label,
            href: l.href,
            children: Array.isArray(l.children) ? l.children : [],
          }))
        : base.header.navLinks,
    } as typeof base.header;
    merged.hero = {
      ...base.hero,
      ...(r.hero ?? {}),
      trustItems: Array.isArray(r.hero?.trustItems) ? r.hero!.trustItems! : base.hero.trustItems,
      avatars: Array.isArray(r.hero?.avatars) ? r.hero!.avatars! : base.hero.avatars,
    } as typeof base.hero;
    merged.guarantee = {
      ...base.guarantee,
      ...(r.guarantee ?? {}),
      items: Array.isArray(r.guarantee?.items) ? r.guarantee!.items! : base.guarantee.items,
    } as typeof base.guarantee;
    merged.videos = {
      ...base.videos,
      ...(r.videos ?? {}),
      // videoIds MUST be string[]. If the server has a stale string
      // (e.g. from an older save that didn't go through the transform),
      // fall back to defaults so the home page list still works.
      videoIds: Array.isArray((r.videos as any)?.videoIds)
        ? (r.videos as any).videoIds
        : base.videos.videoIds,
      playlistUrl:
        typeof (r.videos as any)?.playlistUrl === 'string' && (r.videos as any).playlistUrl
          ? (r.videos as any).playlistUrl
          : base.videos.playlistUrl,
    } as typeof base.videos;
    merged.seminars = {
      ...base.seminars,
      ...(r.seminars ?? {}),
      header: { ...base.seminars.header, ...((r.seminars as any)?.header ?? {}) },
      // The seminars array is the most critical nested payload — if a save
      // ever omits it (form-group bug, partial PUT, corrupted localStorage),
      // fall back to the bundled defaults rather than rendering an empty
      // admin table.
      seminars: Array.isArray((r.seminars as any)?.seminars)
        ? (r.seminars as any).seminars
        : base.seminars.seminars,
    } as typeof base.seminars;
    merged.unserBeitrag = {
      ...base.unserBeitrag,
      ...(r.unserBeitrag ?? {}),
      items: Array.isArray((r.unserBeitrag as any)?.items)
        ? (r.unserBeitrag as any).items
        : base.unserBeitrag.items,
    } as typeof base.unserBeitrag;
    merged.responsibility = {
      ...base.responsibility,
      ...(r.responsibility ?? {}),
      articles: Array.isArray((r.responsibility as any)?.articles)
        ? (r.responsibility as any).articles
        : base.responsibility.articles,
      feature: { ...base.responsibility.feature, ...((r.responsibility as any)?.feature ?? {}) },
    } as typeof base.responsibility;
    merged.aboutUs = {
      ...base.aboutUs,
      ...(r.aboutUs ?? {}),
      stories: Array.isArray((r.aboutUs as any)?.stories)
        ? (r.aboutUs as any).stories
        : base.aboutUs.stories,
      stats: Array.isArray((r.aboutUs as any)?.stats)
        ? (r.aboutUs as any).stats
        : base.aboutUs.stats,
    } as typeof base.aboutUs;
    merged.weltfair = {
      ...base.weltfair,
      ...(r.weltfair ?? {}),
      posts: Array.isArray((r.weltfair as any)?.posts)
        ? (r.weltfair as any).posts
        : base.weltfair.posts,
    } as typeof base.weltfair;
    merged.wirsuchensie = {
      ...base.wirsuchensie,
      ...(r.wirsuchensie ?? {}),
      jobs: Array.isArray((r.wirsuchensie as any)?.jobs)
        ? (r.wirsuchensie as any).jobs
        : base.wirsuchensie.jobs,
    } as typeof base.wirsuchensie;
    merged.footer = {
      ...base.footer,
      ...(r.footer ?? {}),
      contact: Array.isArray(r.footer?.contact) ? r.footer!.contact! : base.footer.contact,
      columns: Array.isArray(r.footer?.columns) ? r.footer!.columns! : base.footer.columns,
      legal: Array.isArray(r.footer?.legal) ? r.footer!.legal! : base.footer.legal,
    } as typeof base.footer;

    // Plan sub-features
    merged.plans = merged.plans.map((p, i) => ({
      ...base.plans[i] ?? base.plans[0],
      ...p,
      features: Array.isArray(p.features) ? p.features : (base.plans[i]?.features ?? []),
    }));

    // Footer column links
    merged.footer.columns = merged.footer.columns.map((c, i) => ({
      ...base.footer.columns[i] ?? base.footer.columns[0],
      ...c,
      links: Array.isArray(c.links) ? c.links : (base.footer.columns[i]?.links ?? []),
    }));

    return merged;
  }

  private hydrate(): SiteContent {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_CONTENT);
      return this.merge(JSON.parse(raw));
    } catch {
      return structuredClone(DEFAULT_CONTENT);
    }
  }

  private writeLocal(c: SiteContent): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {
      /* ignore quota / privacy mode */
    }
  }

  private formatError(err: any): string {
    if (err?.status === 0) return 'Backend nicht erreichbar (läuft der Server?)';
    if (err?.status) return `Fehler ${err.status}: ${err.statusText || 'Server-Antwort fehlgeschlagen'}`;
    return err?.message ?? 'Unbekannter Fehler';
  }

  /**
   * Heuristic: real /api/content responses are JSON objects/arrays. If the
   * host instead answers with the SPA's index.html (common on static hosts
   * like Vercel with no serverless function), the body starts with '<' —
   * treat that as "no backend".
   */
  private looksLikeJson(body: string): boolean {
    const t = (body ?? '').trim();
    return t.startsWith('{') || t.startsWith('[');
  }
}
