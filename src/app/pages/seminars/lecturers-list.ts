import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Lecturer } from '../../core/content.types';
import { Icon } from '../../shared/icon';

function slugify(text: string): string {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

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
  private readonly router = inject(Router);

  /** Sorted by `order` then by name. */
  readonly lecturers = computed<Lecturer[]>(() =>
    [...this.content.lecturers()].sort((a, b) => {
      const oa = a.order ?? 999;
      const ob = b.order ?? 999;
      return oa - ob || a.name.localeCompare(b.name);
    }),
  );

  /** IDs currently being duplicated, keyed by the source lecturer id. */
  readonly duplicating = signal<Set<string>>(new Set());

  initialsOf(l: Lecturer): string {
    return l.name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  /**
   * Duplicates a lecturer. Creates a copy with a unique id, " (Kopie)" appended
   * to the name, the same role/avatar/bio/expertise/contact, and an order that
   * places it right after the source. Then navigates to the new edit page so
   * the user can adjust the copy before saving.
   */
  async duplicateLecturer(source: Lecturer, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (this.duplicating().has(source.id)) return;

    const next = this.duplicating();
    next.add(source.id);
    this.duplicating.set(new Set(next));

    try {
      const all = this.content.lecturers();
      const baseId = source.id;
      const newId = this.uniqueId(baseId, all);
      const copy: Lecturer = {
        ...source,
        id: newId,
        name: this.uniqueName(source.name, all),
        order: (source.order ?? 999) + 1,
        avatar: source.avatar,
      };
      const nextContent = { ...this.content.content(), lecturers: [...all, copy] };
      const res = await this.content.save(nextContent);
      if (res.ok) {
        await this.router.navigate(['/seminars/lecturers', newId, 'edit']);
      }
    } finally {
      const done = this.duplicating();
      done.delete(source.id);
      this.duplicating.set(new Set(done));
    }
  }

  /** Find a unique id derived from `base` that doesn't collide with existing lecturers. */
  private uniqueId(base: string, all: Lecturer[]): string {
    const taken = new Set(all.map((l) => l.id));
    if (!taken.has(base)) return base;
    for (let i = 2; i < 1000; i++) {
      const candidate = `${base}-copy-${i}`;
      if (!taken.has(candidate)) return candidate;
    }
    return `${base}-copy-${Date.now()}`;
  }

  /** Find a unique display name by appending " (Kopie)" / " (Kopie 2)" / … */
  private uniqueName(name: string, all: Lecturer[]): string {
    const taken = new Set(all.map((l) => l.name.toLowerCase()));
    const base = `${name} (Kopie)`;
    if (!taken.has(base.toLowerCase())) return base;
    for (let i = 2; i < 1000; i++) {
      const candidate = `${name} (Kopie ${i})`;
      if (!taken.has(candidate.toLowerCase())) return candidate;
    }
    return `${base} ${slugify(String(Date.now()))}`;
  }
}
