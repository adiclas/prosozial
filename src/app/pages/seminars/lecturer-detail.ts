import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { Lecturer } from '../../core/content.types';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-lecturer-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './lecturer-detail.html',
  styleUrl: './lecturer-detail.scss',
})
export class LecturerDetail {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly params = toSignal(this.route.paramMap, { initialValue: null });

  /** ID from the route, null while the param map is still hydrating. */
  private readonly idParam = computed<string | null>(() => this.params()?.get('id') ?? null);

  /** The lecturer being viewed — null when the id is invalid or still loading. */
  readonly lecturer = computed<Lecturer | null>(() => {
    const id = this.idParam();
    if (!id) return null;
    return this.content.lecturers().find((l) => l.id === id) ?? null;
  });

  /** Seminars that reference this lecturer (for the "Verwendet in" section). */
  readonly seminarsUsing = computed(() => {
    const id = this.idParam();
    if (!id) return [];
    const list = this.content.seminars().seminars ?? [];
    return list
      .filter((s) => Array.isArray(s.lecturerIds) && s.lecturerIds.includes(id))
      .map((s) => ({
        id: s.id,
        title: s.title,
        status: s.status,
        provider: s.provider,
        nextDate: s.dates?.[0]?.date ?? null,
      }));
  });

  /** Initials fallback when no avatar is set. */
  initials(l: Lecturer): string {
    return (l.name ?? '')
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  /** Status label, mirrors the seminar-list mapping. */
  statusLabel(status: string): string {
    switch (status) {
      case 'available':    return 'Plätze frei';
      case 'few-seats':    return 'Wenige Plätze';
      case 'fully-booked': return 'Ausgebucht';
      case 'cancelled':    return 'Abgesagt';
      default:             return status;
    }
  }

  /** Go back to wherever the user came from (fallback: lecturers list). */
  goBack(): void {
    const id = this.idParam();
    const from = (history.state as { back?: string } | null)?.back;
    if (from && from !== this.router.url) {
      this.router.navigateByUrl(from);
      return;
    }
    // If we came from a seminar detail page, jump back there for context
    if (id) {
      this.router.navigate(['/seminars']);
      return;
    }
    this.router.navigate(['/seminars/lecturers']);
  }
}