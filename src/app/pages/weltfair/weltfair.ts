import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { IconName } from '../../icons';
import { WeltfairPost } from '../../core/content.types';
import { Icon } from '../../shared/icon';

/** Map a Weltfair category to a sensible default icon. */
function iconForCategory(category: string): IconName {
  const c = (category ?? '').toLowerCase();
  if (c.includes('fair')) return 'heart';
  if (c.includes('global') || c.includes('welt')) return 'globe';
  if (c.includes('liefer') || c.includes('supply') || c.includes('kette')) return 'truck';
  if (c.includes('verantwort') || c.includes('responsib')) return 'shield-check';
  if (c.includes('mensch') || c.includes('people') || c.includes('story')) return 'user';
  if (c.includes('klima') || c.includes('natur') || c.includes('umwelt')) return 'sparkle';
  return 'badge-leaf';
}

@Component({
  selector: 'app-weltfair',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './weltfair.html',
  styleUrl: './weltfair.scss',
})
export class Weltfair {
  private readonly content = inject(ContentService);

  readonly data = this.content.weltfair;
  readonly posts = computed<WeltfairPost[]>(() => this.data()?.posts ?? []);

  /** Featured post = first one in the list. */
  readonly featured = computed<WeltfairPost | null>(() => this.posts()[0] ?? null);
  /** Rest of the posts, in the order admins set. */
  readonly rest = computed<WeltfairPost[]>(() => this.posts().slice(1));

  /** Icon for the placeholder image based on a post's category. */
  postIcon(category: string): IconName {
    return iconForCategory(category);
  }

  /** Read the CMS date (already human-formatted) or fall back to "Weltfair-Beitrag". */
  shortMeta(p: WeltfairPost): string {
    return p.meta ?? 'Weltfair-Beitrag';
  }
}