import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { ContentService } from '../core/content.service';
import { IconName, ICONS } from '../icons';
import { AuthService } from '../core/auth.service';
import { Icon } from '../shared/icon';

type SectionId =
  | 'header'
  | 'hero'
  | 'featuresHeader'
  | 'features'
  | 'servicesHeader'
  | 'services'
  | 'showcase'
  | 'videosHeader'
  | 'videos'
  | 'badgesHeader'
  | 'badges'
  | 'guarantee'
  | 'plans'
  | 'team'
  | 'ctaStrip'
  | 'footer';

const ICON_NAMES = Object.keys(ICONS) as IconName[];

@Component({
  selector: 'app-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Icon, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private readonly fb = inject(FormBuilder);
  private readonly contentService = inject(ContentService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly iconNames = ICON_NAMES;
  readonly user = this.auth.user;
  readonly current = this.contentService.content;
  readonly status = this.contentService.status;
  readonly error = this.contentService.error;
  readonly lastSyncedAt = this.contentService.lastSyncedAt;

  readonly active = signal<SectionId>('hero');

  readonly sections: { id: SectionId; label: string; group: string }[] = [
    { id: 'header', label: 'Header / Navigation', group: 'Chrome' },
    { id: 'hero', label: 'Hero', group: 'Hero' },
    { id: 'featuresHeader', label: 'Header — Kategorien', group: 'Features' },
    { id: 'features', label: 'Feature-Karten', group: 'Features' },
    { id: 'servicesHeader', label: 'Header — Sortiment', group: 'Sortiment' },
    { id: 'services', label: 'Service-Karten', group: 'Sortiment' },
    { id: 'showcase', label: 'Vorher / Nachher', group: 'Showcase' },
    { id: 'videosHeader', label: 'Header — Videos', group: 'Videos' },
    { id: 'videos', label: 'YouTube-Playlist', group: 'Videos' },
    { id: 'badgesHeader', label: 'Header — Zertifikate', group: 'Zertifikate' },
    { id: 'badges', label: 'Zertifikate', group: 'Zertifikate' },
    { id: 'guarantee', label: 'Garantie', group: 'Sonstiges' },
    { id: 'plans', label: 'Preispläne', group: 'Sonstiges' },
    { id: 'team', label: 'Team', group: 'Sonstiges' },
    { id: 'ctaStrip', label: 'CTA-Streifen', group: 'Footer' },
    { id: 'footer', label: 'Footer', group: 'Footer' },
  ];

  readonly activeSection = computed(() => this.sections.find((s) => s.id === this.active())!);

  readonly groupedSections = computed(() => {
    const groups = new Map<string, { id: SectionId; label: string }[]>();
    for (const s of this.sections) {
      if (!groups.has(s.group)) groups.set(s.group, []);
      groups.get(s.group)!.push({ id: s.id, label: s.label });
    }
    return Array.from(groups.entries()).map(([name, items]) => ({ name, items }));
  });

  // ---------- Form per section ----------
  readonly form: FormGroup = this.buildForm();

  private buildForm(): FormGroup {
    return this.fb.group({
      header: this.fb.group({
        brand: [this.current().header.brand, Validators.required],
        ctaLabel: [this.current().header.ctaLabel, Validators.required],
        ctaHref: [this.current().header.ctaHref, Validators.required],
        navLinks: this.fb.array(
          this.current().header.navLinks.map((l) =>
            this.fb.group({ label: [l.label, Validators.required], href: [l.href, Validators.required] }),
          ),
        ),
      }),
      hero: this.fb.group({
        eyebrow: [this.current().hero.eyebrow],
        titleLine1: [this.current().hero.titleLine1, Validators.required],
        titleLine2: [this.current().hero.titleLine2, Validators.required],
        titleLine2Accent: [this.current().hero.titleLine2Accent],
        lead: [this.current().hero.lead],
        cardTitle: [this.current().hero.cardTitle],
        cardSubtitle: [this.current().hero.cardSubtitle],
        cardIcon: [this.current().hero.cardIcon],
        cardTopText: [this.current().hero.cardTopText],
        ratingScore: [this.current().hero.ratingScore],
        ratingCount: [this.current().hero.ratingCount],
        ctaPrimary: this.fb.group({
          label: [this.current().hero.ctaPrimary.label, Validators.required],
          href: [this.current().hero.ctaPrimary.href, Validators.required],
        }),
        ctaSecondary: this.fb.group({
          label: [this.current().hero.ctaSecondary.label, Validators.required],
          href: [this.current().hero.ctaSecondary.href, Validators.required],
        }),
        trustItems: this.fb.array(
          this.current().hero.trustItems.map((t) =>
            this.fb.group({ icon: [t.icon], label: [t.label, Validators.required] }),
          ),
        ),
        avatars: this.fb.array(
          this.current().hero.avatars.map((a) =>
            this.fb.group({ initials: [a.initials], color: [a.color] }),
          ),
        ),
      }),
      featuresHeader: this.sectionHeaderGroup(this.current().featuresHeader),
      features: this.fb.array(
        this.current().features.map((f) =>
          this.fb.group({
            title: [f.title, Validators.required],
            description: [f.description],
            icon: [f.icon],
            highlight: [f.highlight],
            cta: [f.cta],
          }),
        ),
      ),
      servicesHeader: this.sectionHeaderGroup(this.current().servicesHeader),
      services: this.fb.array(
        this.current().services.map((s) =>
          this.fb.group({ title: [s.title, Validators.required], description: [s.description], icon: [s.icon] }),
        ),
      ),
      showcase: this.fb.group({
        beforeLabel: [this.current().showcase.beforeLabel],
        beforeTitle: [this.current().showcase.beforeTitle],
        beforeNote: [this.current().showcase.beforeNote],
        afterLabel: [this.current().showcase.afterLabel],
        afterTitle: [this.current().showcase.afterTitle],
        afterNote: [this.current().showcase.afterNote],
        step1Title: [this.current().showcase.step1Title],
        step1Text: [this.current().showcase.step1Text],
        step2Title: [this.current().showcase.step2Title],
        step2Text: [this.current().showcase.step2Text],
        step3Title: [this.current().showcase.step3Title],
        step3Text: [this.current().showcase.step3Text],
      }),
      videosHeader: this.sectionHeaderGroup(this.current().videosHeader),
      videos: this.fb.group({
        playlistUrl: [this.current().videos.playlistUrl, [Validators.required, Validators.pattern(/youtube\.com|youtu\.be/)]],
        videoIds: this.fb.control(
          (this.current().videos.videoIds ?? []).join('\n'),
          [this.videoIdsValidator],
        ),
      }),
      badgesHeader: this.sectionHeaderGroup(this.current().badgesHeader),
      badges: this.fb.array(
        this.current().badges.map((b) =>
          this.fb.group({ title: [b.title, Validators.required], description: [b.description], icon: [b.icon] }),
        ),
      ),
      guarantee: this.fb.group({
        title: [this.current().guarantee.title],
        text: [this.current().guarantee.text],
        sealIcon: [this.current().guarantee.sealIcon],
        items: this.fb.array(
          this.current().guarantee.items.map((i) => this.fb.control(i, Validators.required)),
        ),
      }),
      plans: this.fb.array(
        this.current().plans.map((p) =>
          this.fb.group({
            name: [p.name, Validators.required],
            badge: [p.badge],
            price: [p.price, Validators.required],
            period: [p.period],
            description: [p.description],
            cta: [p.cta, Validators.required],
            variant: [p.variant, Validators.required],
            features: this.fb.array(p.features.map((f) => this.fb.control(f, Validators.required))),
          }),
        ),
      ),
      team: this.fb.group({
        teamTitle: [this.current().teamTitle],
        teamText: [this.current().teamText],
        team: this.fb.array(
          this.current().team.map((m) =>
            this.fb.group({
              name: [m.name, Validators.required],
              role: [m.role],
              rating: [m.rating, [Validators.min(1), Validators.max(5)]],
              initials: [m.initials],
              avatarColor: [m.avatarColor],
            }),
          ),
        ),
      }),
      ctaStrip: this.fb.group({
        eyebrow: [this.current().ctaStrip.eyebrow],
        title: [this.current().ctaStrip.title],
        text: [this.current().ctaStrip.text],
        ctaLabel: [this.current().ctaStrip.ctaLabel],
        ctaHref: [this.current().ctaStrip.ctaHref],
        phoneLabel: [this.current().ctaStrip.phoneLabel],
        phoneHref: [this.current().ctaStrip.phoneHref],
      }),
      footer: this.fb.group({
        brand: [this.current().footer.brand],
        description: [this.current().footer.description],
        copyright: [this.current().footer.copyright],
        contact: this.fb.array(
          this.current().footer.contact.map((c) =>
            this.fb.group({ icon: [c.icon], text: [c.text, Validators.required] }),
          ),
        ),
        columns: this.fb.array(
          this.current().footer.columns.map((col) =>
            this.fb.group({
              title: [col.title, Validators.required],
              links: this.fb.array(
                col.links.map((l) =>
                  this.fb.group({ label: [l.label, Validators.required], href: [l.href, Validators.required] }),
                ),
              ),
            }),
          ),
        ),
        legal: this.fb.array(
          this.current().footer.legal.map((l) =>
            this.fb.group({ label: [l.label, Validators.required], href: [l.href, Validators.required] }),
          ),
        ),
      }),
    });
  }

  private sectionHeaderGroup(h: { eyebrow: string; title: string; text: string }): FormGroup {
    return this.fb.group({ eyebrow: [h.eyebrow], title: [h.title], text: [h.text] });
  }

  // ---------- Cast helpers for template ----------
  asGroup(ctrl: unknown): FormGroup {
    return ctrl as FormGroup;
  }
  asArray(ctrl: unknown): FormArray {
    return ctrl as FormArray;
  }
  asControl(ctrl: unknown): FormControl {
    return ctrl as FormControl;
  }

  // ---------- Accessor shortcuts used in template ----------
  get heroGroup(): FormGroup { return this.form.get('hero') as FormGroup; }
  get heroTrustItems(): FormArray { return this.heroGroup.get('trustItems') as FormArray; }
  get heroAvatars(): FormArray { return this.heroGroup.get('avatars') as FormArray; }
  get featuresArr(): FormArray { return this.form.get('features') as FormArray; }
  get servicesArr(): FormArray { return this.form.get('services') as FormArray; }
  get badgesArr(): FormArray { return this.form.get('badges') as FormArray; }
  get plansArr(): FormArray { return this.form.get('plans') as FormArray; }
  get teamMembersArr(): FormArray { return this.form.get('team.team') as FormArray; }
  get guaranteeItemsArr(): FormArray { return this.form.get('guarantee.items') as FormArray; }
  get headerNavArr(): FormArray { return this.form.get('header.navLinks') as FormArray; }
  get footerColumnsArr(): FormArray { return this.form.get('footer.columns') as FormArray; }
  get footerContactArr(): FormArray { return this.form.get('footer.contact') as FormArray; }
  get footerLegalArr(): FormArray { return this.form.get('footer.legal') as FormArray; }

  planFeaturesAt(i: number): FormArray {
    return (this.plansArr.at(i) as FormGroup).get('features') as FormArray;
  }
  footerColumnLinksAt(i: number): FormArray {
    return (this.footerColumnsArr.at(i) as FormGroup).get('links') as FormArray;
  }

  // ---------- Mutations ----------
  addTo<T>(arr: FormArray, factory: () => FormGroup): void {
    arr.push(factory());
  }
  removeAt(arr: FormArray, i: number): void {
    arr.removeAt(i);
  }

  newFeature(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: [''],
      icon: ['star'],
      highlight: [false],
      cta: [''],
    });
  }
  newService(): FormGroup {
    return this.fb.group({ title: ['', Validators.required], description: [''], icon: ['star'] });
  }
  newBadge(): FormGroup {
    return this.fb.group({ title: ['', Validators.required], description: [''], icon: ['star'] });
  }
  newPlan(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      badge: [''],
      price: [''],
      period: [''],
      description: [''],
      cta: ['', Validators.required],
      variant: ['basic', Validators.required],
      features: this.fb.array([]),
    });
  }
  newTeamMember(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      role: [''],
      rating: [5, [Validators.min(1), Validators.max(5)]],
      initials: [''],
      avatarColor: ['#4daf6a'],
    });
  }
  newNavLink(): FormGroup {
    return this.fb.group({ label: ['', Validators.required], href: ['#', Validators.required] });
  }
  newTrustItem(): FormGroup {
    return this.fb.group({ icon: ['shield-check'], label: ['', Validators.required] });
  }
  newAvatar(): FormGroup {
    return this.fb.group({ initials: ['A'], color: ['#4daf6a'] });
  }
  newColumn(): FormGroup {
    return this.fb.group({ title: ['', Validators.required], links: this.fb.array([]) });
  }
  newColumnLink(): FormGroup {
    return this.fb.group({ label: ['', Validators.required], href: ['#', Validators.required] });
  }
  newContact(): FormGroup {
    return this.fb.group({ icon: ['phone'], text: ['', Validators.required] });
  }
  newLegal(): FormGroup {
    return this.fb.group({ label: ['', Validators.required], href: ['#', Validators.required] });
  }

  addStringItem(arr: FormArray): void {
    arr.push(this.fb.control('', Validators.required));
  }

  /** Each line should be a YouTube URL or 11-char video ID. */
  videoIdsValidator(ctrl: import('@angular/forms').AbstractControl): { [k: string]: any } | null {
    const raw = (ctrl.value ?? '') as string;
    const ids = raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return null; // empty is allowed
    const bad = ids.find((s) => !/^([a-zA-Z0-9_-]{11}|https?:\/\/\S+)$/.test(s));
    return bad ? { badId: { value: bad } } : null;
  }

  videoIdsToString(ids: string[]): string {
    return (ids ?? []).join('\n');
  }

  videoIdsFromString(raw: string): string[] {
    return (raw ?? '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }

  /**
   * Reorders a FormArray after a drag-drop event. The control is moved
   * (not just the data) so the form's `getRawValue()` reflects the new order
   * and the persisted payload on save is correct.
   */
  drop(event: CdkDragDrop<unknown>, arr: FormArray): void {
    const from = event.previousIndex;
    const to = event.currentIndex;
    if (from === to) return;
    const ctrl = arr.at(from);
    arr.removeAt(from);
    arr.insert(to, ctrl);
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue() as any;
    // The admin form keeps `videos.videoIds` as a newline-separated string
    // (easier to edit in a textarea). Split it back to a string[] before
    // handing off to the content service.
    if (value?.videos && typeof value.videos.videoIds === 'string') {
      value.videos = {
        ...value.videos,
        videoIds: this.videoIdsFromString(value.videos.videoIds),
      };
    }
    await this.contentService.save(value);
  }

  async reset(): Promise<void> {
    if (!confirm('Alle Inhalte auf die Werkseinstellungen zurücksetzen?')) return;
    await this.contentService.reset();
    // Rebuild the form to reflect new values
    Object.keys(this.form.controls).forEach((k) => {
      const newForm = this.buildForm();
      this.form.setControl(k, newForm.get(k)!);
    });
  }

  async refresh(): Promise<void> {
    await this.contentService.refresh();
    Object.keys(this.form.controls).forEach((k) => {
      const newForm = this.buildForm();
      this.form.setControl(k, newForm.get(k)!);
    });
  }

  setActive(id: SectionId): void {
    this.active.set(id);
  }

  logout(): void {
    this.auth.logout();
  }
}
