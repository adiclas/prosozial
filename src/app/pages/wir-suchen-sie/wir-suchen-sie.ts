import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { IconName } from '../../icons';
import { JobPosting } from '../../core/content.types';
import { Icon } from '../../shared/icon';

/** Map a job category to a sensible default icon. */
function iconForCategory(category: string): IconName {
  const c = (category ?? '').toLowerCase();
  if (c.includes('pflege') || c.includes('beratung') || c.includes('medizin')) return 'heart-pulse';
  if (c.includes('kunden') || c.includes('service') || c.includes('support')) return 'user';
  if (c.includes('logistik') || c.includes('versand') || c.includes('lager')) return 'truck';
  if (c.includes('verwaltung') || c.includes('buchhaltung') || c.includes('abrechnung')) return 'badge-leaf';
  if (c.includes('it') || c.includes('tech') || c.includes('entwicklung')) return 'sparkle';
  if (c.includes('marketing') || c.includes('vertrieb') || c.includes('sales')) return 'trophy';
  if (c.includes('ausbildung') || c.includes('praktikum') || c.includes('azubi')) return 'shield-check';
  return 'check';
}

@Component({
  selector: 'app-wir-suchen-sie',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './wir-suchen-sie.html',
  styleUrl: './wir-suchen-sie.scss',
})
export class WirSuchenSie {
  private readonly content = inject(ContentService);

  readonly data = this.content.wirsuchensie;
  readonly jobs = computed<JobPosting[]>(() => this.data()?.jobs ?? []);

  /** Featured position = first one in the list. */
  readonly featured = computed<JobPosting | null>(() => this.jobs()[0] ?? null);
  /** Rest of the open positions. */
  readonly rest = computed<JobPosting[]>(() => this.jobs().slice(1));

  /** Icon for the placeholder image based on a job's category. */
  jobIcon(category: string): IconName {
    return iconForCategory(category);
  }

  /** Read the CMS meta (e.g. "Lahnstein · Vollzeit") or fall back to "Standort". */
  shortMeta(j: JobPosting): string {
    return j.meta ?? 'Standort wird ergänzt';
  }
}