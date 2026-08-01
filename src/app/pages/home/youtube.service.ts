import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface YouTubeVideo {
  id: string;
  title: string;
  author: string;
  authorUrl: string;
  thumbnail: string;
  error?: string;
}

export interface YouTubePlaylistResponse {
  items: YouTubeVideo[];
}

/**
 * Fetches YouTube video metadata via the server's `/api/youtube/videos`
 * endpoint. The server uses the public oEmbed API (no key required) and
 * caches each video for 24h.
 */
@Injectable({ providedIn: 'root' })
export class YouTubeService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, YouTubeVideo>();
  private readonly failed = new Set<string>(); // IDs that returned 404 etc.

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async load(ids: string[]): Promise<YouTubeVideo[]> {
    if (ids.length === 0) return [];
    // Skip both successful and previously-failed IDs
    const missing = ids.filter((id) => !this.cache.has(id) && !this.failed.has(id));
    this.loading.set(true);
    this.error.set(null);
    try {
      if (missing.length > 0) {
        const res = await firstValueFrom(
          this.http.post<YouTubePlaylistResponse>('/api/youtube/videos', { ids: missing }),
        );
        for (const item of res.items) {
          if (item.error) {
            this.failed.add(item.id);
          } else {
            this.cache.set(item.id, item);
          }
        }
      }
      return ids.map((id) =>
        this.cache.get(id) ?? {
          id,
          title: id,
          author: '',
          authorUrl: '',
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          error: this.failed.has(id) ? 'Video nicht gefunden' : undefined,
        },
      );
    } catch (err: any) {
      this.error.set(this.formatError(err));
      return ids.map((id) => ({
        id,
        title: id,
        author: '',
        authorUrl: '',
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      }));
    } finally {
      this.loading.set(false);
    }
  }

  private formatError(err: any): string {
    if (err?.status === 0) return 'Backend nicht erreichbar';
    return err?.message ?? 'Unbekannter Fehler';
  }
}
