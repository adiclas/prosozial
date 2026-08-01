import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Seminar, SeminarStatus } from '../../core/content.types';
import { Icon } from '../../shared/icon';

const STATUS_LABELS: Record<SeminarStatus, string> = {
  available: 'Plätze frei',
  'few-seats': 'Wenige Plätze',
  'fully-booked': 'Ausgebucht',
  cancelled: 'Abgesagt',
};

@Component({
  selector: 'app-seminars-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './seminars-list.html',
  styleUrl: './seminars-list.scss',
})
export class SeminarsList {
  private readonly content = inject(ContentService);

  readonly header = this.content.seminars;
  readonly seminars = computed<Seminar[]>(() => this.content.seminars().seminars ?? []);
  readonly statusLabels = STATUS_LABELS;

  nextDateLabel(s: Seminar): string {
    const first = s.dates?.[0];
    return first?.date ?? 'Termin folgt';
  }

  statusLabel(s: SeminarStatus): string {
    return this.statusLabels[s] ?? s;
  }
}
