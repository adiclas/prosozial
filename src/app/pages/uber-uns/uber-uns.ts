import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { IconName } from '../../icons';
import { Icon } from '../../shared/icon';

/** Picks a meaningful icon for each story block based on its category. */
function iconForStory(category: string): IconName {
  const c = (category ?? '').toLowerCase();
  if (c.includes('seit') || c.includes('gründ') || c.includes('2008')) return 'badge-leaf';
  if (c.includes('qualität') || c.includes('zertif')) return 'shield-check';
  if (c.includes('anspruch') || c.includes('halt') || c.includes('philosophie')) return 'heart';
  if (c.includes('team') || c.includes('mensch')) return 'user';
  return 'sparkle';
}

@Component({
  selector: 'app-uber-uns',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './uber-uns.html',
  styleUrl: './uber-uns.scss',
})
export class UberUns {
  private readonly content = inject(ContentService);

  readonly data = this.content.aboutUs;
  readonly stories = computed(() => this.data().stories ?? []);
  readonly stats = computed(() => this.data().stats ?? []);

  /** Icon to use for a story block's image placeholder. */
  storyIcon(category: string): IconName {
    return iconForStory(category);
  }
}