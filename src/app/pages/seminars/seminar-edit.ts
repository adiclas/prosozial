import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { ContentService } from '../../core/content.service';
import { Seminar } from '../../core/content.types';
import { Icon } from '../../shared/icon';
import {
  asArray,
  asControl,
  newSeminarDateGroup,
  newSeminarDocumentGroup,
  newSeminarSessionGroup,
  newSeminarGroup,
  slugify,
} from './seminar-form';

const NEW_ID = '__new__';

@Component({
  selector: 'app-seminar-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Icon, CdkDropList, CdkDrag, CdkDragHandle],
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
  /** Long-lived server error (cleared on next save). */
  readonly error = this.content.error;
  /** Short-lived client error (e.g. image upload failures). */
  readonly uploadError = signal<string | null>(null);

  readonly id = computed<string | typeof NEW_ID>(() => this.params()?.get('id') ?? NEW_ID);
  readonly isNew = computed(() => this.id() === NEW_ID);

  readonly seminar = computed<Seminar | null>(() => {
    const id = this.id();
    if (id === NEW_ID) return null;
    return this.content.seminars().seminars.find((s) => s.id === id) ?? null;
  });

  readonly pageTitle = computed(() =>
    this.isNew() ? 'Neues Seminar' : `Seminar bearbeiten: ${this.seminar()?.title ?? this.id()}`,
  );

  readonly form: FormGroup = this.buildForm();
  readonly saving = signal(false);
  readonly dirty = signal(false);
  readonly deleting = signal(false);

  /** Section IDs in display order, used by the sticky sidebar nav. */
  readonly sections = [
    { id: 'basics',     label: 'Grundlagen' },
    { id: 'logistics',  label: 'Ort & Kosten' },
    { id: 'description',label: 'Beschreibung' },
    { id: 'dates',      label: 'Termine' },
    { id: 'lecturers',  label: 'Vortragende' },
    { id: 'documents',  label: 'Dokumente' },
    { id: 'bullets',    label: 'Inhaltspunkte' },
  ];

  /** Per-section completion status for the sidebar. */
  readonly completion = computed<Record<string, boolean>>(() => ({
    basics:      !!this.form.get('title')?.value && !!this.form.get('status')?.value,
    logistics:   !!this.form.get('provider')?.value,
    description: !!this.form.get('description')?.value,
    dates:       (this.form.get('dates') as FormArray)?.length > 0,
    lecturers:   (this.form.get('lecturers') as FormArray)?.length > 0,
    documents:   true, // optional
    bullets:     true, // optional
  }));

  readonly currentSection = signal<string>('basics');

  constructor() {
    queueMicrotask(() => this.rebuild());

    // Track dirty state and keep the live signal in sync with the form.
    this.form.valueChanges.subscribe(() => {
      this.dirty.set(true);
      const raw = this.form.get('lecturerIds')?.value;
      this.lecturerIdsValue.set(Array.isArray(raw) ? raw : []);
    });
  }

  asControl = asControl;

  // ---------- FormArray getters ----------
  get datesArr(): FormArray { return this.form.get('dates') as FormArray; }
  get documentsArr(): FormArray { return this.form.get('documents') as FormArray; }
  get bulletsArr(): FormArray { return this.form.get('bullets') as FormArray; }
  datesAt(i: number): FormArray { return (this.datesArr.at(i) as FormGroup).get('sessions') as FormArray; }

  // ---------- Mutations ----------
  addDate(): void { this.datesArr.push(newSeminarDateGroup(this.fb)); this.dirty.set(true); }
  removeDate(i: number): void { this.datesArr.removeAt(i); this.dirty.set(true); }

  addSession(dateIndex: number): void { this.datesAt(dateIndex).push(newSeminarSessionGroup(this.fb)); this.dirty.set(true); }
  removeSession(dateIndex: number, sessionIndex: number): void { this.datesAt(dateIndex).removeAt(sessionIndex); this.dirty.set(true); }

  readonly allLecturers = computed(() => this.content.lecturers());

  /** Live form value as a signal so the template reacts to every change. */
  private readonly lecturerIdsValue = signal<string[]>([]);

  /** Selected lecturer IDs as a Set for O(1) membership checks. */
  readonly selectedLecturerIds = computed(() => new Set(this.lecturerIdsValue()));

  isLecturerSelected(id: string): boolean {
    return this.selectedLecturerIds().has(id);
  }

  toggleLecturer(id: string): void {
    const control = this.form.get('lecturerIds');
    if (!control) return;
    const current: string[] = Array.isArray(control.value) ? [...control.value] : [];
    const i = current.indexOf(id);
    if (i >= 0) current.splice(i, 1);
    else current.push(id);
    control.setValue(current);
    this.lecturerIdsValue.set(current);
    this.dirty.set(true);
  }

  initialsOf(name: string): string {
    return (name ?? '')
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  // NOTE: avatar upload now lives on /seminars/lecturers/:id/edit
  // (the global pool page). The chip selector here just references IDs.

  // ---------- Drag-to-reorder ----------
  dropDates(event: CdkDragDrop<unknown>): void { this.reorder(this.datesArr, event); this.dirty.set(true); }
  dropSessions(dateIndex: number, event: CdkDragDrop<unknown>): void { this.reorder(this.datesAt(dateIndex), event); this.dirty.set(true); }
  dropDocuments(event: CdkDragDrop<unknown>): void { this.reorder(this.documentsArr, event); this.dirty.set(true); }
  dropBullets(event: CdkDragDrop<unknown>): void { this.reorder(this.bulletsArr, event); this.dirty.set(true); }

  private reorder(arr: FormArray, event: CdkDragDrop<unknown>): void {
    const from = event.previousIndex;
    const to = event.currentIndex;
    if (from === to) return;
    const ctrl = arr.at(from);
    arr.removeAt(from);
    arr.insert(to, ctrl);
  }

  /** Resize + recompress an image to a small JPEG data URL via canvas. */
  private compressImage(file: File, maxSize: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('read failed'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('decode failed'));
        img.onload = () => {
          const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
          const w = Math.round(img.width * ratio);
          const h = Math.round(img.height * ratio);
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('canvas 2d unavailable'));
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);
          // PNGs with transparency stay PNG, everything else becomes JPEG (much smaller)
          const isPng = file.type === 'image/png';
          const out = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality);
          resolve(out);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  private flashError(msg: string): void {
    this.uploadError.set(msg);
    setTimeout(() => {
      if (this.uploadError() === msg) this.uploadError.set(null);
    }, 4000);
  }

  addDocument(): void { this.documentsArr.push(newSeminarDocumentGroup(this.fb)); this.dirty.set(true); }
  removeDocument(i: number): void { this.documentsArr.removeAt(i); this.dirty.set(true); }

  addBullet(): void { this.bulletsArr.push(this.fb.control('')); this.dirty.set(true); }
  removeBullet(i: number): void { this.bulletsArr.removeAt(i); this.dirty.set(true); }

  // ---------- Section nav ----------
  scrollTo(id: string, event?: Event): void {
    event?.preventDefault();
    this.currentSection.set(id);
    queueMicrotask(() => {
      document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ---------- Save / cancel / delete ----------
  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.scrollTo('basics');
      return;
    }
    this.saving.set(true);
    try {
      const raw = this.form.getRawValue() as Seminar;
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
        this.dirty.set(false);
        // For a brand-new seminar, swap the URL in place to its canonical
        // /seminars/:id/edit so a page reload lands on the same seminar.
        // Don't re-render or navigate — stay on this page.
        if (this.isNew()) {
          this.router.navigate(['/seminars', raw.id, 'edit'], {
            replaceUrl: true,
          });
        }
        // For existing seminars: just stay. The content service has
        // already pushed the update to the server and to every other tab
        // (via the next GET). The save bar shows "Auf Server gespeichert"
        // for ~2s and then "Bereit".
      }
    } finally {
      this.saving.set(false);
    }
  }

  async deleteSeminar(): Promise<void> {
    if (this.isNew()) {
      this.router.navigate(['/admin'], { queryParams: { section: 'seminars' } });
      return;
    }
    const id = this.id() as string;
    const title = this.seminar()?.title ?? id;
    if (!confirm(`„${title}" wirklich löschen? Dies kann nicht rückgängig gemacht werden.`)) {
      return;
    }
    this.deleting.set(true);
    try {
      const all = this.content.content().seminars.seminars ?? [];
      const nextList = all.filter((s) => s.id !== id);
      const nextContent = {
        ...this.content.content(),
        seminars: { ...this.content.content().seminars, seminars: nextList },
      };
      const res = await this.content.save(nextContent);
      if (res.ok) {
        this.router.navigate(['/admin'], { queryParams: { section: 'seminars' } });
      }
    } finally {
      this.deleting.set(false);
    }
  }

  cancel(): void {
    if (this.dirty() && !confirm('Ungespeicherte Änderungen verwerfen?')) {
      return;
    }
    this.router.navigate(['/admin'], { queryParams: { section: 'seminars' } });
  }

  // ---------- Build / rebuild ----------
  private buildForm(): FormGroup {
    const data = this.isNew() ? undefined : this.seminar() ?? undefined;
    return this.fb.group(newSeminarGroup(this.fb, data).controls);
  }

  private rebuild(): void {
    const next = this.buildForm();
    for (const key of Object.keys(next.controls)) {
      this.form.setControl(key, (next as any).controls[key]);
    }
    // Sync the live signal with the freshly-built form value.
    const initial = (this.form.get('lecturerIds')?.value as string[] | null) ?? [];
    this.lecturerIdsValue.set(Array.isArray(initial) ? initial : []);
    this.dirty.set(false);
  }

  /** Generate a unique slug by appending -2, -3, … if needed. */
  private async uniqueSlug(base: string): Promise<string> {
    const all =
      (await this.content.refresh().then(() => this.content.content().seminars.seminars)) ?? [];
    const taken = new Set(all.map((s) => s.id));
    if (!taken.has(base)) return base;
    for (let i = 2; i < 1000; i++) {
      const candidate = `${base}-${i}`;
      if (!taken.has(candidate)) return candidate;
    }
    return `${base}-${Date.now()}`;
  }
}
