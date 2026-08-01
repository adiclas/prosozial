import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Seminar } from '../../core/content.types';

/* ----------------------------------------------------------------
   Form builders — shared between the admin inline form and the
   dedicated /seminars/:id/edit page.
   ---------------------------------------------------------------- */

export function newSeminarGroup(fb: FormBuilder, s?: Partial<Seminar>): FormGroup {
  return fb.group({
    id: [s?.id ?? '', [Validators.pattern(/^[a-z0-9-]*$/)]],
    title: [s?.title ?? '', Validators.required],
    status: [s?.status ?? 'available', Validators.required],
    provider: [s?.provider ?? ''],
    location: [s?.location ?? ''],
    supplierLocation: [s?.supplierLocation ?? ''],
    cost: [s?.cost ?? ''],
    description: [s?.description ?? ''],
    bullets: fb.array((s?.bullets ?? []).map((b) => fb.control(b ?? ''))),
    dates: fb.array((s?.dates ?? []).map((d) => newSeminarDateGroup(fb, d))),
    lecturers: fb.array((s?.lecturers ?? []).map((l) => newSeminarLecturerGroup(fb, l))),
    documents: fb.array((s?.documents ?? []).map((d) => newSeminarDocumentGroup(fb, d))),
  });
}

export function newSeminarDateGroup(fb: FormBuilder, d?: any): FormGroup {
  return fb.group({
    date: [d?.date ?? '', Validators.required],
    label: [d?.label ?? ''],
    sessions: fb.array((d?.sessions ?? []).map((s: any) => newSeminarSessionGroup(fb, s))),
  });
}

export function newSeminarSessionGroup(fb: FormBuilder, s?: any): FormGroup {
  return fb.group({
    time: [s?.time ?? '', Validators.required],
    title: [s?.title ?? ''],
  });
}

export function newSeminarLecturerGroup(fb: FormBuilder, l?: any): FormGroup {
  return fb.group({
    name: [l?.name ?? '', Validators.required],
    role: [l?.role ?? ''],
    avatar: [l?.avatar ?? ''],
  });
}

export function newSeminarDocumentGroup(fb: FormBuilder, d?: any): FormGroup {
  return fb.group({
    label: [d?.label ?? '', Validators.required],
    url: [d?.url ?? '', Validators.required],
  });
}

/** Convert a title to a URL slug. Empty string if nothing usable remains. */
export function slugify(text: string): string {
  return (text ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Type-safe cast helpers used by templates. */
export const asControl = (c: unknown): FormControl => c as FormControl;
export const asArray = (c: unknown): FormArray => c as FormArray;
