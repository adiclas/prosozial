import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-unser-beitrag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './unser-beitrag.html',
  styleUrl: './unser-beitrag.scss',
})
export class UnserBeitrag {
  private readonly content = inject(ContentService);

  /** Full content block for the "Unser Beitrag" section. */
  readonly data = this.content.unserBeitrag;

  /** Items array (empty fallback so the template never breaks). */
  readonly items = computed(() => this.data()?.items ?? []);
}