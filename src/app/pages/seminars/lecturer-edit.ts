import { ChangeDetectionStrategy, Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { Lecturer } from '../../core/content.types';
import { Icon } from '../../shared/icon';

const NEW_ID = '__new__';

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

interface SidebarSection {
  id: string;
  label: string;
  number: string;
  requiredFields: string[];
}

@Component({
  selector: 'app-lecturer-edit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Icon],
  templateUrl: './lecturer-edit.html',
  styleUrl: './lecturer-edit.scss',
})
export class LecturerEdit {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly params = toSignal(this.route.paramMap, { initialValue: null });

  readonly id = computed<string | typeof NEW_ID>(() => this.params()?.get('id') ?? NEW_ID);
  readonly isNew = computed(() => this.id() === NEW_ID);

  readonly lecturer = computed<Lecturer | null>(() => {
    const id = this.id();
    if (id === NEW_ID) return null;
    return this.content.lecturers().find((l) => l.id === id) ?? null;
  });

  readonly pageTitle = computed(() =>
    this.isNew() ? 'Neuer Dozent' : `Dozent bearbeiten: ${this.lecturer()?.name ?? this.id()}`,
  );

  readonly form: FormGroup = this.buildForm();
  readonly saving = signal(false);
  readonly dirty = signal(false);
  readonly deleting = signal(false);
  readonly uploadError = signal<string | null>(null);
  readonly error = this.content.error;
  readonly currentSection = signal<string>('profile');
  readonly lastSavedAt = signal<number | null>(null);

  readonly sections: SidebarSection[] = [
    { id: 'profile', label: 'Profil', number: '01', requiredFields: ['name', 'role'] },
    { id: 'photo', label: 'Foto', number: '02', requiredFields: ['avatarColor'] },
    { id: 'contact', label: 'Kontakt', number: '03', requiredFields: [] },
    { id: 'expertise', label: 'Schwerpunkte', number: '04', requiredFields: [] },
  ];

  readonly completion = computed<Record<string, boolean>>(() => ({
    profile: !!this.form.get('name')?.value && !!this.form.get('role')?.value,
    photo: !!this.form.get('avatarColor')?.value,
    contact: true,
    expertise: this.expertiseList().length > 0,
  }));

  readonly expertiseDraft = signal<string>('');
  readonly expertiseList = computed<string[]>(() => {
    const raw = (this.form.get('expertise')?.value ?? '') as string;
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  });

  readonly preview = computed<Lecturer>(() => {
    const f = this.form.getRawValue() as any;
    return {
      id: f.id || slugify(f.name) || 'neu',
      name: f.name || 'Vorname Nachname',
      role: f.role || 'Rolle / Position',
      avatar: f.avatar || undefined,
      avatarColor: f.avatarColor || '#007F41',
      bio: f.bio || undefined,
      email: f.email || undefined,
      phone: f.phone || undefined,
      expertise: this.expertiseList(),
      order: f.order,
    };
  });

  countUses(id: string): number {
    return this.content.seminars().seminars.filter((s) => (s.lecturerIds ?? []).includes(id)).length;
  }

  constructor() {
    let loaded = false;
    effect(() => {
      const l = this.lecturer();
      if (l && !loaded) {
        loaded = true;
        this.rebuild();
      }
    });
    this.form.valueChanges.subscribe(() => this.dirty.set(true));
  }

  scrollTo(id: string, event?: Event): void {
    event?.preventDefault();
    this.currentSection.set(id);
    queueMicrotask(() => {
      document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  formatSavedAt(ts: number): string {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 5) return 'gerade eben';
    if (diff < 60) return `vor ${diff} Sek.`;
    if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
    return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  // ---------- Avatar upload ----------
  async onAvatarChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.flashError(`"${file.name}" ist kein Bild.`);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      this.flashError('Bild ist größer als 8 MB.');
      return;
    }
    try {
      const dataUrl = await this.compressImage(file, 240, 0.7);
      this.form.get('avatar')?.setValue(dataUrl);
      this.dirty.set(true);
    } catch {
      this.flashError('Bild konnte nicht verarbeitet werden.');
    }
  }

  clearAvatar(): void {
    this.form.get('avatar')?.setValue('');
    this.dirty.set(true);
  }

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
          const isPng = file.type === 'image/png';
          resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality));
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

  // ---------- Expertise chips ----------
  addExpertise(): void {
    const draft = this.expertiseDraft().trim().replace(/,$/, '');
    if (!draft) return;
    const existing = this.expertiseList();
    if (existing.includes(draft)) { this.expertiseDraft.set(''); return; }
    this.form.get('expertise')?.setValue([...existing, draft].join(', '));
    this.expertiseDraft.set('');
    this.dirty.set(true);
  }

  removeExpertise(tag: string): void {
    this.form.get('expertise')?.setValue(this.expertiseList().filter((t) => t !== tag).join(', '));
    this.dirty.set(true);
  }

  onExpertiseKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addExpertise();
    } else if (event.key === 'Backspace' && this.expertiseDraft() === '' && this.expertiseList().length > 0) {
      this.removeExpertise(this.expertiseList().at(-1)!);
    }
  }

  onExpertineInput(event: Event): void {
    this.expertiseDraft.set((event.target as HTMLInputElement).value);
  }

  // ---------- Form build ----------
  private buildForm(): FormGroup {
    const data = this.isNew() ? undefined : this.lecturer() ?? undefined;
    return this.fb.group({
      id: [data?.id ?? '', [Validators.pattern(/^[a-z0-9-]*$/)]],
      name: [data?.name ?? '', Validators.required],
      role: [data?.role ?? '', Validators.required],
      avatar: [data?.avatar ?? ''],
      avatarColor: [data?.avatarColor ?? '#007F41'],
      bio: [data?.bio ?? ''],
      email: [data?.email ?? '', [Validators.email]],
      phone: [data?.phone ?? ''],
      expertise: [(data?.expertise ?? []).join(', ')],
      order: [data?.order ?? 999],
    });
  }

  private rebuild(): void {
    const data = this.isNew() ? undefined : this.lecturer() ?? undefined;
    this.form.patchValue(
      {
        id: data?.id ?? '',
        name: data?.name ?? '',
        role: data?.role ?? '',
        avatar: data?.avatar ?? '',
        avatarColor: data?.avatarColor ?? '#007F41',
        bio: data?.bio ?? '',
        email: data?.email ?? '',
        phone: data?.phone ?? '',
        expertise: (data?.expertise ?? []).join(', '),
        order: data?.order ?? 999,
      },
      { emitEvent: false },
    );
    this.dirty.set(false);
  }

  // ---------- Keyboard shortcuts ----------
  @HostListener('document:keydown', ['$event'])
  onGlobalKey(event: KeyboardEvent): void {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const cmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;
    if (cmdOrCtrl && event.key.toLowerCase() === 's') {
      event.preventDefault();
      this.save();
    } else if (event.key === 'Escape' && this.dirty()) {
      event.preventDefault();
      this.cancel();
    }
  }

  // ---------- Save / cancel / delete ----------
  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.scrollTo('profile');
      return;
    }
    this.saving.set(true);
    try {
      const raw = this.form.getRawValue() as any;
      const expertise = (raw.expertise ?? '').split(',').map((s: string) => s.trim()).filter(Boolean);
      const next: Lecturer = {
        id: raw.id || slugify(raw.name),
        name: raw.name,
        role: raw.role,
        avatar: raw.avatar || undefined,
        avatarColor: raw.avatarColor || undefined,
        bio: raw.bio || undefined,
        email: raw.email || undefined,
        phone: raw.phone || undefined,
        expertise: expertise.length ? expertise : undefined,
        order: raw.order,
      };
      const all = this.content.lecturers();
      const nextList = this.isNew()
        ? [...all, next]
        : all.map((l) => (l.id === this.id() ? next : l));
      const nextContent = { ...this.content.content(), lecturers: nextList };
      const res = await this.content.save(nextContent);
      if (res.ok) {
        this.dirty.set(false);
        this.lastSavedAt.set(Date.now());
        if (this.isNew()) {
          this.router.navigate(['/seminars/lecturers', next.id, 'edit'], { replaceUrl: true });
        }
      }
    } finally {
      this.saving.set(false);
    }
  }

  async deleteLecturer(): Promise<void> {
    if (this.isNew()) { this.cancel(); return; }
    const id = this.id() as string;
    const name = this.lecturer()?.name ?? id;
    if (!confirm(`„${name}" wirklich löschen?`)) return;
    this.deleting.set(true);
    try {
      const all = this.content.lecturers();
      const nextList = all.filter((l) => l.id !== id);
      const nextContent = { ...this.content.content(), lecturers: nextList };
      const res = await this.content.save(nextContent);
      if (res.ok) this.router.navigate(['/seminars/lecturers']);
    } finally {
      this.deleting.set(false);
    }
  }

  cancel(): void {
    if (this.dirty() && !confirm('Ungespeicherte Änderungen verwerfen?')) return;
    this.router.navigate(['/seminars/lecturers']);
  }
}
