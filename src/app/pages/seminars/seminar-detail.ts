import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { Lecturer, Seminar, SeminarStatus } from '../../core/content.types';
import { Icon } from '../../shared/icon';

const STATUS_LABELS: Record<SeminarStatus, string> = {
  available: 'Plätze frei',
  'few-seats': 'Wenige Plätze',
  'fully-booked': 'Ausgebucht',
  cancelled: 'Abgesagt',
};

@Component({
  selector: 'app-seminar-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './seminar-detail.html',
  styleUrl: './seminar-detail.scss',
})
export class SeminarDetail {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly params = toSignal(this.route.paramMap, { initialValue: null });
  readonly statusLabels = STATUS_LABELS;

  readonly seminar = computed<Seminar | null>(() => {
    const id = this.params()?.get('id');
    if (!id) return null;
    return this.content.seminars().seminars.find((s) => s.id === id) ?? null;
  });

  /** Resolve the seminar's lecturerIds to global Lecturer objects, in order. */
  readonly lecturers = computed<Lecturer[]>(() => {
    const s = this.seminar();
    if (!s) return [];
    const pool = this.content.lecturers();
    return (s.lecturerIds ?? [])
      .map((id) => pool.find((l) => l.id === id))
      .filter((l): l is Lecturer => !!l);
  });

  statusLabel(s: SeminarStatus): string {
    return this.statusLabels[s] ?? s;
  }

  goBack(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/seminars']);
  }
}
