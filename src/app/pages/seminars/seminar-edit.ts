import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { Seminar } from '../../core/content.types';
import { Icon } from '../../shared/icon';
import {
  asArray,
  asControl,
  newSeminarDateGroup,
  newSeminarDocumentGroup,
  newSeminarGroup,
  newSeminarLecturerGroup,
  newSeminarSessionGroup,
  slugify,
} from './seminar-form';

const NEW_ID = '__new__';

@Component({
  selector: 'app-seminar-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Icon],
  templateUrl: './seminar-edit.html',
  styleUrl: './seminar-edit.scss',
})
export class SeminarEdit {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly params = toSignal(this.route.paramMap, { initialValue: null });

  readonly status = this.content.status;
  readonly error = this.content.error;

  /** "new" for the create flow, or the seminar id for the edit flow. */
  readonly id = computed<string | typeof NEW_ID>(() => this.params()?.get('id') ?? NEW_ID);
  readonly isNew = computed(() => this.id() === NEW_ID);

  readonly seminar = computed<Seminar | null>(() => {
    const id = this.id();
    if (id === NEW_ID) return null;
    return this.content.seminars().seminars.find((s) => s.id === id) ?? null;
  });

  /** Page title used in the header. */
  readonly pageTitle = computed(() => (this.isNew() ? 'Neues Seminar' : `Seminar bearbeiten: ${this.seminar()?.title ?? this.id()}`));

  readonly form: FormGroup = this.buildForm();
  readonly saving = signal(false);

  /** Rebuild the form whenever the loaded seminar changes. */
  constructor() {
    // Re-create the form once the route param has resolved.
    // Angular's toSignal emits the latest paramMap on each navigation.
    queueMicrotask(() => this.rebuild());
  }

  /** Expose the cast helper for use in the template. */
  asControl = asControl;

  /** Recreate the form with the seminar from the content service. */
  private buildForm(): FormGroup {
    const data = this.isNew() ? undefined : this.seminar() ?? undefined;
    return this.fb.group(newSeminarGroup(this.fb, data).controls);
  }

  private rebuild(): void {
    const next = this.buildForm();
    // Replace each control to avoid tearing down the component.
    for (const key of Object.keys(next.controls)) {
      this.form.setControl(key, (next as any).controls[key]);
    }
  }

  // ---------- FormArray getters ----------
  get datesArr(): FormArray { return this.form.get('dates') as FormArray; }
  get lecturersArr(): FormArray { return this.form.get('lecturers') as FormArray; }
  get documentsArr(): FormArray { return this.form.get('documents') as FormArray; }
  get bulletsArr(): FormArray { return this.form.get('bullets') as FormArray; }

  datesAt(i: number): FormArray { return (this.datesArr.at(i) as FormGroup).get('sessions') as FormArray; }

  // ---------- Mutations ----------
  addDate(): void { this.datesArr.push(newSeminarDateGroup(this.fb)); }
  removeDate(i: number): void { this.datesArr.removeAt(i); }

  addSession(dateIndex: number): void { this.datesAt(dateIndex).push(newSeminarSessionGroup(this.fb)); }
  removeSession(dateIndex: number, sessionIndex: number): void {
    this.datesAt(dateIndex).removeAt(sessionIndex);
  }

  addLecturer(): void { this.lecturersArr.push(newSeminarLecturerGroup(this.fb)); }
  removeLecturer(i: number): void { this.lecturersArr.removeAt(i); }

  addDocument(): void { this.documentsArr.push(newSeminarDocumentGroup(this.fb)); }
  removeDocument(i: number): void { this.documentsArr.removeAt(i); }

  addBullet(): void { this.bulletsArr.push(this.fb.control('')); }
  removeBullet(i: number): void { this.bulletsArr.removeAt(i); }

  // ---------- Save / cancel ----------
  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    try {
      const raw = this.form.getRawValue() as Seminar;
      // Auto-derive id from title if missing (and slug is unique).
      if (!raw.id) {
        raw.id = await this.uniqueSlug(slugify(raw.title));
      }
      const all = this.content.content().seminars.seminars ?? [];
      const nextList = this.isNew()
        ? [...all, raw]
        : all.map((s) => (s.id === this.id() ? { ...raw, id: this.id() as string } : s));
      const nextContent = {
        ...this.content.content(),
        seminars: { ...this.content.content().seminars, seminars: nextList },
      };
      const res = await this.content.save(nextContent);
      if (res.ok) {
        this.router.navigate(['/admin'], { queryParams: { section: 'seminars' } });
      }
    } finally {
      this.saving.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/admin'], { queryParams: { section: 'seminars' } });
  }

  /** Generate a unique slug by appending -2, -3, … if needed. */
  private async uniqueSlug(base: string): Promise<string> {
    const all = (await this.content.refresh().then(() => this.content.content().seminars.seminars)) ?? [];
    const taken = new Set(all.map((s) => s.id));
    if (!taken.has(base)) return base;
    for (let i = 2; i < 1000; i++) {
      const candidate = `${base}-${i}`;
      if (!taken.has(candidate)) return candidate;
    }
    return `${base}-${Date.now()}`;
  }
}
