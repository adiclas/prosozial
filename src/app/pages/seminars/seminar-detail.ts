import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { Lecturer, Seminar, SeminarDate, SeminarStatus } from '../../core/content.types';
import { Icon } from '../../shared/icon';

const STATUS_LABELS: Record<SeminarStatus, string> = {
  available: 'Plätze frei',
  'few-seats': 'Wenige Plätze',
  'fully-booked': 'Ausgebucht',
  cancelled: 'Abgesagt',
};

/** Pretty-print a cost field that may be a number or already-formatted string. */
function formatCost(raw: string | number): string {
  if (typeof raw === 'number') {
    return raw.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' €';
  }
  const s = String(raw).trim();
  if (!s) return '';
  // If it already contains a currency symbol or "incl"/"excl", trust the CMS string.
  if (/[€$£]|incl|excl|netto|brutto/i.test(s)) return s;
  // Otherwise treat as a bare number and format it.
  const n = Number(s);
  if (Number.isFinite(n)) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' €';
  }
  return s;
}

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

  /** List of dates (always an array even if seminar has none). */
  readonly sDates = computed<SeminarDate[]>(() => this.seminar()?.dates ?? []);

  /** Total number of sessions across all dates. */
  readonly totalSessions = computed<number>(() =>
    this.sDates().reduce((sum, d) => sum + (d.sessions?.length ?? 0), 0),
  );

  /** Default contact email used by the "Anmeldung per E-Mail" CTA. */
  readonly contactEmail = computed<string>(() => 'service@prosozial.de');

  statusLabel(s: SeminarStatus): string {
    return this.statusLabels[s] ?? s;
  }

  formatCost(raw: string | number): string {
    return formatCost(raw);
  }

  goBack(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/seminars']);
  }

  /**
   * Placeholder for a future waitlist API. For now, opens the user's mail
   * client with a pre-filled subject so they can request to be notified when
   * a seat opens up.
   */
  joinWaitlist(s: Seminar): void {
    const subject = encodeURIComponent(`Warteliste: ${s.title}`);
    const body = encodeURIComponent(
      `Hallo,\n\nbitte setzen Sie mich auf die Warteliste für "${s.title}".\n\nVielen Dank!`,
    );
    window.location.href = `mailto:${this.contactEmail()}?subject=${subject}&body=${body}`;
  }
}
