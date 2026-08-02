import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { IconName } from '../../icons';
import { Icon } from '../../shared/icon';

/** Map a category label to a sensible default icon for the placeholder thumbnail. */
function iconForCategory(category: string): IconName {
  const c = (category ?? '').toLowerCase();
  if (c.includes('umwelt') || c.includes('klima') || c.includes('natur')) return 'globe';
  if (c.includes('sozial') || c.includes('mensch') || c.includes('team')) return 'heart';
  if (c.includes('liefer') || c.includes('qualität') || c.includes('standard')) return 'shield-check';
  if (c.includes('region') || c.includes('standort') || c.includes('lokal')) return 'globe';
  if (c.includes('fokus')) return 'sparkle';
  return 'badge-leaf';
}

@Component({
  selector: 'app-verantwortung',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './verantwortung.html',
  styleUrl: './verantwortung.scss',
})
export class Verantwortung {
  private readonly content = inject(ContentService);

  readonly data = this.content.responsibility;
  readonly feature = computed(() => this.data().feature);
  readonly articles = computed(() => this.data().articles ?? []);

  /** Picks an icon for the placeholder card based on the article's category. */
  categoryIcon(category: string): IconName {
    return iconForCategory(category);
  }
}