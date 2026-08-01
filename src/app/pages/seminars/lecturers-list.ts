import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Lecturer } from '../../core/content.types';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-lecturers-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './lecturers-list.html',
  styleUrl: './lecturers-list.scss',
})
export class LecturersList {
  private readonly content = inject(ContentService);

  /** Sorted by `order` then by name. */
  readonly lecturers = computed<Lecturer[]>(() =>
    [...this.content.lecturers()].sort((a, b) => {
      const oa = a.order ?? 999;
      const ob = b.order ?? 999;
      return oa - ob || a.name.localeCompare(b.name);
    }),
  );

  initialsOf(l: Lecturer): string {
    return l.name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
