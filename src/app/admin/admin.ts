import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
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
  | 'unserBeitrag'
  | 'responsibility'
  | 'aboutUs'
  | 'footer'
  | 'seminarsHeader'
  | 'seminars';

interface SectionNavItem {
  id: SectionId;
  label: string;
  group: string;
  icon: IconName;
  count?: number;
  route?: never;
}

interface LinkNavItem {
  id?: never;
  label: string;
  group: string;
  icon: IconName;
  route: string;
}

type NavItem = { id?: SectionId; label: string; route?: string; icon: IconName };

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
  private readonly route = inject(ActivatedRoute);

  /**
   * `:section` route param — maps a friendly URL like
   * `/admin/header-navigation` to the matching `SectionId`.
   * Defaults to `hero` when missing or unknown so the admin never lands
   * on an empty screen.
   */
  private readonly sectionParam = toSignal(this.route.paramMap, { initialValue: null });

  /** Static lookup table: URL slug → SectionId. */
  private readonly SECTION_SLUGS: Record<string, SectionId> = {
    'header':                  'header',
    'header-navigation':       'header',
    'header-marke':            'header',
    'hero':                     'hero',
    'features-header':         'featuresHeader',
    'features':                'features',
    'services-header':         'servicesHeader',
    'services':                'services',
    'showcase':                'showcase',
    'videos-header':           'videosHeader',
    'videos':                  'videos',
    'badges-header':           'badgesHeader',
    'badges':                  'badges',
    'guarantee':               'guarantee',
    'plans':                   'plans',
    'team':                    'team',
    'cta-strip':               'ctaStrip',
    'cta':                     'ctaStrip',
    'footer':                  'footer',
    'seminars-header':         'seminarsHeader',
    'seminars':                'seminars',
    'unser-beitrag':           'unserBeitrag',
    'unserbeitrag':            'unserBeitrag',
    'responsibility':          'responsibility',
    'verantwortung':          'responsibility',
    'about-us':                'aboutUs',
    'about':                   'aboutUs',
  };

  readonly iconNames = ICON_NAMES;
  readonly user = this.auth.user;
  readonly current = this.contentService.content;
  readonly status = this.contentService.status;
  readonly error = this.contentService.error;
  readonly lastSyncedAt = this.contentService.lastSyncedAt;

  /** Whether to show the validation-error banner above the section. */
  readonly showValidationAlert = signal(false);
  /** Description of invalid fields for the validation banner. */
  readonly validationAlertMessage = computed(() => {
    if (!this.showValidationAlert()) return '';
    const invalid = this.collectInvalidFields(this.form);
    if (!invalid.length) return 'Ein oder mehrere Felder sind ungültig.';
    return `${invalid.length} Feld${invalid.length === 1 ? '' : 'er'} ausfüllen: ${invalid.slice(0, 3).join(', ')}${invalid.length > 3 ? ' …' : ''}`;
  });

  readonly active = signal<SectionId>('hero');

  /**
   * Admin sidebar items. A section item activates an inline form editor;
   * a link item navigates to a dedicated page (e.g. the lecturer manager).
   * The `icon` is shown in the sidebar and in the section header.
   */
  readonly sections: (SectionNavItem | LinkNavItem)[] = [
    { id: 'header',           label: 'Header / Navigation',  group: 'Chrome',      icon: 'menu' },
    { id: 'hero',             label: 'Hero',                 group: 'Hero',        icon: 'sparkle' },
    { id: 'featuresHeader',   label: 'Header — Kategorien',  group: 'Features',    icon: 'menu' },
    { id: 'features',         label: 'Feature-Karten',       group: 'Features',    icon: 'star' },
    { id: 'servicesHeader',   label: 'Header — Sortiment',   group: 'Sortiment',   icon: 'menu' },
    { id: 'services',         label: 'Service-Karten',       group: 'Sortiment',   icon: 'gauge' },
    { id: 'showcase',         label: 'Vorher / Nachher',     group: 'Showcase',    icon: 'rosette-check' },
    { id: 'videosHeader',     label: 'Header — Videos',      group: 'Videos',      icon: 'menu' },
    { id: 'videos',           label: 'YouTube-Playlist',     group: 'Videos',      icon: 'play' },
    { id: 'badgesHeader',     label: 'Header — Zertifikate', group: 'Zertifikate', icon: 'menu' },
    { id: 'badges',           label: 'Zertifikate',          group: 'Zertifikate', icon: 'badge-leaf' },
    { id: 'guarantee',        label: 'Garantie',             group: 'Vertrauen',   icon: 'shield-check' },
    { id: 'plans',            label: 'Preispläne',           group: 'Vertrauen',   icon: 'award' },
    { id: 'team',             label: 'Team',                 group: 'Vertrauen',   icon: 'user' },
    { id: 'ctaStrip',         label: 'CTA-Streifen',         group: 'Footer',      icon: 'send' },
    { id: 'footer',           label: 'Footer',               group: 'Footer',      icon: 'globe' },
    { id: 'unserBeitrag',     label: 'Unser Beitrag',        group: 'Verantwortung', icon: 'heart' },
    { id: 'responsibility',   label: 'Verantwortung',        group: 'Verantwortung', icon: 'globe' },
    { id: 'aboutUs',           label: 'Über uns',             group: 'Unternehmen',   icon: 'sparkle' },
    { id: 'seminarsHeader',   label: 'Header — Seminare',    group: 'Seminare',    icon: 'menu' },
    { id: 'seminars',         label: 'Seminare',             group: 'Seminare',    icon: 'book' },
    { route: '/seminars/lecturers', label: 'Dozenten',       group: 'Seminare',    icon: 'trophy' },
  ];

  readonly activeSection = computed(() => this.sections.find((s) => (s as SectionNavItem).id === this.active()) as SectionNavItem);

  /** Icon for the active section, used in the topbar and card header. */
  readonly activeIcon = computed(() => this.activeSection()?.icon ?? 'settings');

  /** Group label for the active section — used as the eyebrow in the topbar. */
  readonly activeGroup = computed(() => this.activeSection()?.group ?? '');

  readonly groupedSections = computed(() => {
    const groups = new Map<string, NavItem[]>();
    for (const s of this.sections) {
      if (!groups.has(s.group)) groups.set(s.group, []);
      groups.get(s.group)!.push({
        id: (s as SectionNavItem).id,
        label: s.label,
        route: (s as LinkNavItem).route,
        icon: s.icon,
      });
    }
    return Array.from(groups.entries()).map(([name, items]) => ({ name, items }));
  });

  /** Shortcut signal for the seminars section (used by the table). */
  readonly seminars = computed(() => this.current().seminars);

  /** Used by the videos admin form (for the inline hint link). */
  readonly videos = computed(() => this.current().videos);

  /** Flattened view used by the admin seminars table. */
  readonly seminarsTable = computed(() =>
    (this.seminars()?.seminars ?? []).map((s: any) => {
      const ids: string[] = Array.isArray(s.lecturerIds) ? s.lecturerIds : [];
      const names = ids
        .map((id) => this.current().lecturers?.find((l) => l.id === id)?.name)
        .filter(Boolean);
      return {
        id: s.id,
        title: s.title,
        provider: s.provider,
        lecturerNames: names.join(', '),
      };
    }),
  );

  /** Source seminars (full objects) used by the duplicate action. */
  readonly fullSeminars = computed<any[]>(() => this.seminars()?.seminars ?? []);

  /** IDs currently being duplicated (to disable the button + show spinner). */
  readonly duplicating = signal<Set<string>>(new Set());

  // ---------- Form per section ----------
  readonly form: FormGroup = this.buildForm();

  /**
   * Sync the active section from the URL slug (`:section` route param).
   * Re-runs whenever the user clicks a different sidebar link (which calls
   * `setActive` and navigates), or when the URL is loaded directly.
   */
  private readonly _sectionSync = effect(() => {
    const slug = this.sectionParam()?.get('section');
    if (!slug) return;
    const mapped = this.SECTION_SLUGS[slug.toLowerCase()];
    if (mapped && mapped !== this.active()) {
      this.active.set(mapped);
      this.showValidationAlert.set(false);
    }
  });

  private buildForm(): FormGroup {
    return this.fb.group({
      header: this.fb.group({
        brand: [this.current().header.brand, Validators.required],
        ctaLabel: [this.current().header.ctaLabel, Validators.required],
        ctaHref: [this.current().header.ctaHref, Validators.required],
        navLinks: this.fb.array(
          this.current().header.navLinks.map((l) =>
            this.fb.group({
              label: [l.label, Validators.required],
              href: [l.href ?? ''],
              children: this.fb.array(
                (l.children ?? []).map((c) =>
                  this.fb.group({ label: [c.label, Validators.required], href: [c.href ?? ''] }),
                ),
              ),
            }),
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
      unserBeitrag: this.fb.group({
        eyebrow: [this.current().unserBeitrag.eyebrow],
        title: [this.current().unserBeitrag.title],
        lead: [this.current().unserBeitrag.lead],
        intro: [this.current().unserBeitrag.intro],
        items: this.fb.array(
          (this.current().unserBeitrag.items ?? []).map((it: any) =>
            this.fb.group({
              icon: [it.icon],
              title: [it.title],
              text: [it.text],
              stat: [it.stat ?? ''],
              statLabel: [it.statLabel ?? ''],
            }),
          ),
        ),
        ctaEyebrow: [this.current().unserBeitrag.ctaEyebrow],
        ctaTitle: [this.current().unserBeitrag.ctaTitle],
        ctaText: [this.current().unserBeitrag.ctaText],
        ctaLabel: [this.current().unserBeitrag.ctaLabel],
        ctaHref: [this.current().unserBeitrag.ctaHref],
      }),
      responsibility: this.fb.group({
        eyebrow: [this.current().responsibility.eyebrow],
        title: [this.current().responsibility.title],
        lead: [this.current().responsibility.lead],
        gridTitle: [this.current().responsibility.gridTitle],
        feature: this.fb.group({
          category: [this.current().responsibility.feature.category],
          title: [this.current().responsibility.feature.title],
          excerpt: [this.current().responsibility.feature.excerpt],
          image: [this.current().responsibility.feature.image ?? ''],
          href: [this.current().responsibility.feature.href],
          meta: [this.current().responsibility.feature.meta ?? ''],
        }),
        articles: this.fb.array(
          (this.current().responsibility.articles ?? []).map((a: any) =>
            this.fb.group({
              category: [a.category],
              title: [a.title, Validators.required],
              excerpt: [a.excerpt],
              image: [a.image ?? ''],
              href: [a.href, Validators.required],
              meta: [a.meta ?? ''],
            }),
          ),
        ),
      }),
      aboutUs: this.fb.group({
        eyebrow: [this.current().aboutUs.eyebrow],
        title: [this.current().aboutUs.title],
        lead: [this.current().aboutUs.lead],
        heroCategory: [this.current().aboutUs.heroCategory],
        heroTitle: [this.current().aboutUs.heroTitle],
        heroExcerpt: [this.current().aboutUs.heroExcerpt],
        heroImage: [this.current().aboutUs.heroImage ?? ''],
        heroCtaLabel: [this.current().aboutUs.heroCtaLabel],
        heroCtaHref: [this.current().aboutUs.heroCtaHref],
        storyHeading: [this.current().aboutUs.storyHeading],
        stories: this.fb.array(
          (this.current().aboutUs.stories ?? []).map((s: any) =>
            this.fb.group({
              category: [s.category],
              title: [s.title, Validators.required],
              text: [s.text],
              image: [s.image ?? ''],
              imageSide: [s.imageSide ?? 'right'],
              ctaLabel: [s.ctaLabel ?? ''],
              ctaHref: [s.ctaHref ?? ''],
            }),
          ),
        ),
        statsHeading: [this.current().aboutUs.statsHeading],
        stats: this.fb.array(
          (this.current().aboutUs.stats ?? []).map((st: any) =>
            this.fb.group({
              value: [st.value],
              label: [st.label],
            }),
          ),
        ),
        ctaEyebrow: [this.current().aboutUs.ctaEyebrow],
        ctaTitle: [this.current().aboutUs.ctaTitle],
        ctaText: [this.current().aboutUs.ctaText],
        ctaLabel: [this.current().aboutUs.ctaLabel],
        ctaHref: [this.current().aboutUs.ctaHref],
      }),
      seminarsHeader: this.sectionHeaderGroup(this.current().seminars.header),
      seminars: this.fb.group({
        header: this.sectionHeaderGroup(this.current().seminars.header),
        // Seminars are now edited individually at /seminars/:id/edit, so
        // the admin "Seminare" section only carries the header. The list
        // page reads from the content service directly.
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
  get beitragItemsArr(): FormArray { return this.form.get('unserBeitrag.items') as FormArray; }
  get responsibilityArticlesArr(): FormArray { return this.form.get('responsibility.articles') as FormArray; }
  get aboutStoriesArr(): FormArray { return this.form.get('aboutUs.stories') as FormArray; }
  get aboutStatsArr(): FormArray { return this.form.get('aboutUs.stats') as FormArray; }
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

  // ----- Factory functions for new FormArray rows.
  // These MUST be arrow functions (or pre-bound) — Angular templates invoke
  // them via `this.factoryName` and lose the implicit `this` binding, which
  // causes `Cannot read properties of undefined (reading 'fb')`. Arrow
  // functions capture `this` lexically at definition time.
  readonly newFeature = (): FormGroup => this.fb.group({
    title: ['', Validators.required],
    description: [''],
    icon: ['star'],
    highlight: [false],
    cta: [''],
  });
  readonly newService = (): FormGroup => this.fb.group({ title: ['', Validators.required], description: [''], icon: ['star'] });
  readonly newBadge = (): FormGroup => this.fb.group({ title: ['', Validators.required], description: [''], icon: ['star'] });
  readonly newPlan = (): FormGroup => this.fb.group({
    name: ['', Validators.required],
    badge: [''],
    price: [''],
    period: [''],
    description: [''],
    cta: ['', Validators.required],
    variant: ['basic', Validators.required],
    features: this.fb.array([]),
  });
  readonly newTeamMember = (): FormGroup => this.fb.group({
    name: ['', Validators.required],
    role: [''],
    rating: [5, [Validators.min(1), Validators.max(5)]],
    initials: [''],
    avatarColor: ['#4daf6a'],
  });
  readonly newNavLink = (): FormGroup => this.fb.group({
    label: ['', Validators.required],
    href: ['#'],
    // Children array is always present so toggling between leaf ↔ parent
    // doesn't require structural changes to the form group.
    children: this.fb.array([]),
  });
  readonly newNavSubLink = (): FormGroup => this.fb.group({
    label: ['', Validators.required],
    href: ['#'],
  });
  readonly newTrustItem = (): FormGroup => this.fb.group({ icon: ['shield-check'], label: ['', Validators.required] });
  readonly newAvatar = (): FormGroup => this.fb.group({ initials: ['A'], color: ['#4daf6a'] });
  readonly newColumn = (): FormGroup => this.fb.group({ title: ['', Validators.required], links: this.fb.array([]) });
  readonly newColumnLink = (): FormGroup => this.fb.group({ label: ['', Validators.required], href: ['#', Validators.required] });
  readonly newContact = (): FormGroup => this.fb.group({ icon: ['phone'], text: ['', Validators.required] });
  readonly newLegal = (): FormGroup => this.fb.group({ label: ['', Validators.required], href: ['#', Validators.required] });
  readonly newBeitragItem = (): FormGroup => this.fb.group({
    icon: ['shield-check'],
    title: ['', Validators.required],
    text: ['', Validators.required],
    stat: [''],
    statLabel: [''],
  });
  readonly newResponsibilityArticle = (): FormGroup => this.fb.group({
    category: ['Neu'],
    title: ['', Validators.required],
    excerpt: [''],
    image: [''],
    href: ['/verantwortung', Validators.required],
    meta: [''],
  });
  readonly newAboutStory = (): FormGroup => this.fb.group({
    category: [''],
    title: ['', Validators.required],
    text: [''],
    image: [''],
    imageSide: ['right'],
    ctaLabel: [''],
    ctaHref: [''],
  });
  readonly newAboutStat = (): FormGroup => this.fb.group({
    value: [''],
    label: [''],
  });

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
   * Live count of valid YouTube entries in the videoIds textarea.
   * Reads the form value directly so it updates as the user types.
   * Used by the template to render a "X valid entries" hint that gives
   * feedback before the user tries to save.
   */
  readonly videoIdsValidCount = computed<number>(() => {
    const raw = (this.form.get('videos.videoIds')?.value ?? '') as string;
    const ids = raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    return ids.filter((s) => /^([a-zA-Z0-9_-]{11}|https?:\/\/\S+)$/.test(s)).length;
  });

  /**
   * Predefined pages that admins can target from the navigation-links
   * dropdown. Mirrors the public nav so admins don't have to type URL
   * paths by hand. Keep in sync with `app.routes.ts`.
   */
  readonly navTargetOptions = computed<{ label: string; href: string }[]>(() => [
    { label: '— Startseite',                          href: '/' },
    { label: '— Seminare',                            href: '/seminars' },
    { label: '— Dozenten (Liste)',                    href: '/seminars/lecturers' },
    { label: '— Unser Beitrag',                       href: '/unserbeitrag' },
    { label: '— Verantwortung',                       href: '/verantwortung' },
    { label: '— Über uns',                            href: '/ueber-uns' },
    { label: '— Login',                               href: '/login' },
    { label: '# Bewertungen (Anker)',                 href: '#bewertungen' },
    { label: '# Kontakt (Anker)',                     href: '#kontakt' },
    { label: '# Produkte (Anker)',                    href: '#produkte' },
    { label: '# Ablauf (Anker)',                      href: '#ablauf' },
  ]);

  /**
   * Set the `href` field on a navigation-link row when the user picks
   * a value from the select dropdown. Picking the literal `__custom__`
   * sentinel clears `href` so the template reveals the free-form text
   * input (which writes back via `setCustomHref()`).
   */
  onNavLinkHrefChange(index: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    const row = this.headerNavArr.at(index);
    if (value === '__custom__') {
      // Keep whatever the user has already typed in the custom field;
      // just flip the marker so the template shows the right input.
      const current = row.get('href')?.value ?? '';
      if (this.matchesKnownTarget(current)) {
        row.get('href')?.setValue('');
      }
    } else {
      row.get('href')?.setValue(value);
    }
  }

  /**
   * True when the given `href` exactly matches one of the predefined
   * nav targets. Used to decide whether to show the "Eigene URL" input
   * or just a readonly preview of the current value.
   */
  matchesKnownTarget(href: string | null | undefined): boolean {
    if (!href) return false;
    return this.navTargetOptions().some((opt) => opt.href === href);
  }

  /** Sync a custom URL typed into the "Eigene URL" input back to `href`. */
  setCustomHref(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const row = this.headerNavArr.at(index);
    row.get('href')?.setValue(input.value);
  }

  // ---------- Sub-link helpers (children of a nav parent) ----------

  /** Access the children FormArray of the nav link at `index`. */
  navChildrenAt(index: number): FormArray {
    return this.headerNavArr.at(index).get('children') as FormArray;
  }

  /**
   * Toggle a nav entry between "leaf" (with an href) and "parent"
   * (with children). The children array is always present in the form
   * group — we just clear it to revert to leaf mode, or seed a default
   * child to enter parent mode.
   */
  toggleNavLinkChildren(index: number): void {
    const row = this.headerNavArr.at(index);
    const children = this.navChildrenAt(index);
    if (children.length > 0) {
      // Collapsing to leaf — wipe the children so the render flips back.
      while (children.length) children.removeAt(0);
    } else {
      // Expanding to parent — seed with one empty child + clear href so
      // the parent doesn't link anywhere (the children are the targets).
      children.push(this.newNavSubLink());
      row.get('href')?.setValue('');
    }
  }

  /**
   * Same URL-selection logic as `onNavLinkHrefChange`, but for a child
   * row inside a parent's children array.
   */
  onNavChildHrefChange(parentIndex: number, childIndex: number, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    const child = this.navChildrenAt(parentIndex).at(childIndex);
    if (value === '__custom__') {
      const current = child.get('href')?.value ?? '';
      if (this.matchesKnownTarget(current)) child.get('href')?.setValue('');
    } else {
      child.get('href')?.setValue(value);
    }
  }

  /** Sync a child row's custom URL input back to `href`. */
  setCustomChildHref(parentIndex: number, childIndex: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.navChildrenAt(parentIndex).at(childIndex).get('href')?.setValue(input.value);
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
      // Show the validation banner so the user knows why their click was
      // a no-op. The banner lists the first 3 invalid field names.
      this.showValidationAlert.set(true);
      // Scroll the banner into view (in case the user clicked the save
      // button in the sticky footer and the relevant fields are far away).
      queueMicrotask(() => {
        document.querySelector('.admin-alert')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    // Clear the validation banner once we proceed with a valid save.
    this.showValidationAlert.set(false);
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
    // Patch the existing form with the fresh defaults so that
    // `formControlName` bindings stay intact (replacing controls via
    // setControl breaks the template bindings).
    this.syncFormFromContent();
  }

  /**
   * Pull the latest values from the content service and patch them into the
   * existing form. We deliberately avoid `setControl()` — replacing the
   * underlying FormControls detaches the `formControlName` directives in the
   * template, so user-typed values stop being read on save.
   */
  private syncFormFromContent(): void {
    const fresh = this.contentService.content();
    const videosString = (fresh?.videos?.videoIds ?? []).join('\n');
    const payload: any = {
      ...fresh,
      videos: {
        ...(fresh?.videos ?? {}),
        videoIds: videosString,
      },
    };
    this.form.patchValue(payload, { emitEvent: false });
  }

  /**
   * Duplicates a seminar with a new unique id and " (Kopie)" appended to the
   * title, then navigates to the edit page so the user can adjust it.
   * All other fields (provider, dates, bullets, lecturerIds, etc.) are copied
   * verbatim.
   */
  async duplicateSeminar(source: any, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (this.duplicating().has(source.id)) return;

    const next = this.duplicating();
    next.add(source.id);
    this.duplicating.set(new Set(next));

    try {
      const all = this.fullSeminars() as any[];
      const baseId = source.id;
      const newId = this.uniqueSeminarId(baseId, all);
      // structuredClone deep-copies all nested arrays/objects in one shot.
      // Seminar payloads are JSON-safe (no functions, Dates, etc.) so this
      // is safe and replaces the manual nested map-spread chain.
      const copy: any = {
        ...structuredClone(source),
        id: newId,
        title: this.uniqueSeminarTitle(source.title, all),
      };
      const currentContent = this.contentService.content();
      const seminarsBlock = currentContent?.seminars ?? { header: { eyebrow: '', title: '', text: '' }, seminars: [] };
      const nextContent = {
        ...currentContent,
        seminars: {
          ...seminarsBlock,
          seminars: [...all, copy],
        },
      };
      const res = await this.contentService.save(nextContent);
      if (res.ok) {
        await this.router.navigate(['/seminars', newId, 'edit']);
      }
    } finally {
      const done = this.duplicating();
      done.delete(source.id);
      this.duplicating.set(new Set(done));
    }
  }

  /** Find a unique seminar id derived from `base` that doesn't collide. */
  private uniqueSeminarId(base: string, all: any[]): string {
    const taken = new Set(all.map((s) => s.id));
    if (!taken.has(base)) return base;
    for (let i = 2; i < 1000; i++) {
      const candidate = `${base}-copy-${i}`;
      if (!taken.has(candidate)) return candidate;
    }
    return `${base}-copy-${Date.now()}`;
  }

  /** Find a unique seminar title by appending " (Kopie)" / " (Kopie 2)" / … */
  private uniqueSeminarTitle(title: string, all: any[]): string {
    const taken = new Set(all.map((s) => (s.title ?? '').toLowerCase()));
    const base = `${title} (Kopie)`;
    if (!taken.has(base.toLowerCase())) return base;
    for (let i = 2; i < 1000; i++) {
      const candidate = `${title} (Kopie ${i})`;
      if (!taken.has(candidate.toLowerCase())) return candidate;
    }
    return `${base} ${Date.now()}`;
  }

  async refresh(): Promise<void> {
    await this.contentService.refresh();
    this.syncFormFromContent();
  }

  // -----------------------------------------------------------------
  // Save-bar visibility + alert management
  // -----------------------------------------------------------------

  /**
   * Hide the save bar when nothing is happening — only show it when the user
   * has unsaved changes, when a save is in flight, when the server confirmed
   * the save, or when the last save failed. This keeps the page calm when
   * nothing needs attention.
   */
  readonly savebarHidden = computed(() => {
    const s = this.status();
    if (s === 'saving' || s === 'saved' || s === 'error') return false;
    return !this.form.dirty;
  });

  /** Acknowledge the server-side error banner. */
  dismissError(): void {
    // ContentService keeps the error signal until the next save — clear it
    // here so the user can dismiss without retrying.
    this.contentService.clearError();
  }

  /** Acknowledge the client-side validation banner. */
  dismissValidationAlert(): void {
    this.showValidationAlert.set(false);
  }

  /**
   * Walk the form tree and return a list of human-readable labels for every
   * invalid (required / pattern / email / min / max / validator) control.
   * Used by the validation banner to tell the user exactly what to fix.
   */
  private collectInvalidFields(group: FormGroup, prefix = ''): string[] {
    const out: string[] = [];
    const visit = (ctrl: AbstractControl, path: string): void => {
      if (ctrl instanceof FormGroup) {
        Object.keys(ctrl.controls).forEach((k) => visit(ctrl.controls[k], path ? `${path}.${k}` : k));
      } else if (ctrl instanceof FormArray) {
        ctrl.controls.forEach((c, i) => visit(c, `${path}[${i}]`));
      } else if (ctrl.invalid && ctrl.errors) {
        const label = this.fieldLabelFromPath(path) || path;
        out.push(label);
      }
    };
    visit(group, prefix);
    return out;
  }

  /**
   * Best-effort human label for a control path (`hero.titleLine1` → "Hero Titel Zeile 1").
   * Falls back to the raw path if no label can be derived.
   */
  private fieldLabelFromPath(path: string): string {
    if (!path) return '';
    // Map a few common top-level sections to friendly names
    const sectionAlias: Record<string, string> = {
      header: 'Header',
      hero: 'Hero',
      featuresHeader: 'Header — Kategorien',
      features: 'Feature-Karten',
      servicesHeader: 'Header — Sortiment',
      services: 'Service-Karten',
      showcase: 'Vorher / Nachher',
      videosHeader: 'Header — Videos',
      videos: 'YouTube-Playlist',
      badgesHeader: 'Header — Zertifikate',
      badges: 'Zertifikate',
      guarantee: 'Garantie',
      plans: 'Preispläne',
      team: 'Team',
      ctaStrip: 'CTA-Streifen',
      seminarsHeader: 'Seminare · Header',
      seminars: 'Seminare',
      footer: 'Footer',
    };
    const [section, ...rest] = path.split('.');
    const sectionLabel = sectionAlias[section] ?? section;
    if (!rest.length) return sectionLabel;
    // Strip index brackets and prettify the remaining path
    const field = rest.join('.').replace(/\[\d+\]/g, '');
    if (!field) return sectionLabel;
    return `${sectionLabel} · ${this.prettifyFieldName(field)}`;
  }

  /** camelCase / snake_case → "Titel Zeile 1" */
  private prettifyFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  setActive(id: SectionId): void {
    this.active.set(id);
    // Hide any stale validation banner when the admin switches sections —
    // the validation was for the previous section's fields.
    this.showValidationAlert.set(false);
  }

  logout(): void {
    this.auth.logout();
  }
}
