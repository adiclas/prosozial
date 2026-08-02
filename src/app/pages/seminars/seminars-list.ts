import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Seminar, SeminarSession, SeminarStatus } from '../../core/content.types';
import { Icon } from '../../shared/icon';

const STATUS_LABELS: Record<SeminarStatus, string> = {
  available: 'Plätze frei',
  'few-seats': 'Wenige Plätze',
  'fully-booked': 'Ausgebucht',
  cancelled: 'Abgesagt',
};

const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

const DAYS_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const DAYS_LONG  = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

/**
 * One entry in the timeline = a single scheduled session of a seminar.
 * Flattening `seminars[*].dates[*].sessions[*]` makes the day-by-day view trivial.
 */
interface TimelineEvent {
  seminar: Seminar;
  dateLabel: string;       // original CMS string, e.g. "Donnerstag, 06. August 2026"
  dateObj: Date | null;    // parsed JS Date (null if CMS date was unparseable)
  session: SeminarSession;
}

@Component({
  selector: 'app-seminars-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './seminars-list.html',
  styleUrl: './seminars-list.scss',
})
export class SeminarsList {
  private readonly content = inject(ContentService);

  readonly header = this.content.seminars;
  readonly seminars = computed<Seminar[]>(() => this.content.seminars().seminars ?? []);
  readonly statusLabels = STATUS_LABELS;

  /** Day-by-day buckets, sorted ascending by date. Each bucket has a Date
   *  and a list of events that occur on that day (across all seminars). */
  readonly dayBuckets = computed<{ key: string; dateObj: Date | null; dayLabel: string; events: TimelineEvent[] }[]>(() => {
    const all: TimelineEvent[] = [];
    for (const s of this.seminars()) {
      for (const d of s.dates ?? []) {
        const dateObj = this.parseDate(d.date);
        for (const sess of d.sessions ?? []) {
          all.push({ seminar: s, dateLabel: d.date, dateObj, session: sess });
        }
      }
    }

    // Sort by parsed date (nulls last)
    all.sort((a, b) => {
      if (!a.dateObj && !b.dateObj) return 0;
      if (!a.dateObj) return 1;
      if (!b.dateObj) return -1;
      return a.dateObj.getTime() - b.dateObj.getTime();
    });

    // Group by YYYY-MM-DD
    const buckets = new Map<string, { key: string; dateObj: Date | null; events: TimelineEvent[] }>();
    for (const ev of all) {
      const key = ev.dateObj
        ? `${ev.dateObj.getFullYear()}-${String(ev.dateObj.getMonth() + 1).padStart(2, '0')}-${String(ev.dateObj.getDate()).padStart(2, '0')}`
        : 'unknown';
      if (!buckets.has(key)) {
        buckets.set(key, { key, dateObj: ev.dateObj, events: [] });
      }
      buckets.get(key)!.events.push(ev);
    }

    // Decorate with display labels
    return Array.from(buckets.values()).map((b) => ({
      ...b,
      dayLabel: b.dateObj ? this.formatDayLabel(b.dateObj) : 'Termin folgt',
    }));
  });

  /** The next upcoming date (or first bucket if none in the future). */
  readonly featuredBucket = computed(() => {
    const buckets = this.dayBuckets();
    if (!buckets.length) return null;
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const idx = buckets.findIndex((b) => b.key === todayKey || (b.dateObj && b.dateObj >= now));
    return idx >= 0 ? buckets[idx] : buckets[0];
  });

  /** All buckets, with the featured one marked expanded by default. */
  readonly expanded = signal<Set<string>>(new Set());
  readonly statusFilters = signal<Set<SeminarStatus>>(new Set(['available', 'few-seats', 'fully-booked', 'cancelled']));

  constructor() {
    // By default, expand the featured bucket so users see events immediately.
    const f = this.featuredBucket();
    if (f) this.expanded.set(new Set([f.key]));
  }

  /** Buckets after the active status filter is applied. */
  readonly visibleBuckets = computed(() => {
    const allowed = this.statusFilters();
    return this.dayBuckets().map((b) => ({
      ...b,
      events: b.events.filter((e) => allowed.has(e.seminar.status)),
    })).filter((b) => b.events.length > 0);
  });

  /** Summary stats for the page header. */
  readonly stats = computed(() => {
    const total = this.dayBuckets().reduce((sum, b) => sum + b.events.length, 0);
    const today = new Date();
    const upcoming = this.dayBuckets().filter((b) => b.dateObj && b.dateObj >= today).length;
    return { total, upcoming };
  });

  // ---------- UI helpers ----------
  isExpanded(key: string): boolean {
    return this.expanded().has(key);
  }

  toggleBucket(key: string): void {
    const next = new Set(this.expanded());
    if (next.has(key)) next.delete(key); else next.add(key);
    this.expanded.set(next);
  }

  isStatusActive(s: SeminarStatus): boolean {
    return this.statusFilters().has(s);
  }

  toggleStatus(s: SeminarStatus): void {
    const next = new Set(this.statusFilters());
    if (next.has(s)) next.delete(s); else next.add(s);
    this.expanded.set(new Set()); // collapse all to let the filtered list reopen naturally
    setTimeout(() => {
      const f = this.featuredBucket();
      if (f && this.visibleBuckets().some((b) => b.key === f.key)) {
        const e = new Set(this.expanded());
        e.add(f.key);
        this.expanded.set(e);
      }
    });
  }

  // ---------- Formatters ----------
  statusLabel(s: SeminarStatus): string {
    return this.statusLabels[s] ?? s;
  }

  formatDayLabel(d: Date): string {
    const day = d.getDate();
    const month = MONTHS[d.getMonth()];
    const weekday = DAYS_LONG[d.getDay()];
    return `${weekday}, ${String(day).padStart(2, '0')}. ${month} ${d.getFullYear()}`;
  }

  formatShortDay(d: Date): string {
    return `${DAYS_SHORT[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}.`;
  }

  getMonthName(idx: number): string {
    return MONTHS[idx] ?? '';
  }

  getWeekdayName(idx: number): string {
    return DAYS_LONG[idx] ?? '';
  }

  /** Status filter chip entries — order, label, and dot color. */
  readonly statusFilterEntries = computed<{ id: SeminarStatus; label: string; color: string }[]>(() => [
    { id: 'available',    label: 'Plätze frei',     color: 'var(--color-primary)' },
    { id: 'few-seats',    label: 'Wenige Plätze',   color: '#d99e00' },
    { id: 'fully-booked', label: 'Ausgebucht',      color: 'var(--color-ink-400)' },
    { id: 'cancelled',    label: 'Abgesagt',        color: '#dc2626' },
  ]);

  /** Extract a HH:MM start time from "10:00 – 12:30" or similar. */
  startTime(sessionTime: string): string {
    const m = sessionTime.match(/(\d{1,2}:\d{2})/);
    return m ? m[1] : sessionTime;
  }

  /** Try to parse a CMS date string into a JS Date. Falls back to null. */
  private parseDate(raw: string | undefined): Date | null {
    if (!raw) return null;
    // The CMS often uses strings like "Donnerstag, 06. August 2026".
    // Try native Date first (handles ISO + many EU formats).
    const direct = new Date(raw);
    if (!Number.isNaN(direct.getTime())) return direct;

    // German month name → number
    const monthMap: Record<string, number> = {
      januar: 0, februar: 1, märz: 2, april: 3, mai: 4, juni: 5,
      juli: 6, august: 7, september: 8, oktober: 9, november: 10, dezember: 11,
    };
    const m = raw.toLowerCase().match(/(\d{1,2})\.\s*([a-zäöü]+)\s*(\d{4})/);
    if (m) {
      const day = Number(m[1]);
      const month = monthMap[m[2]];
      const year = Number(m[3]);
      if (month !== undefined) return new Date(year, month, day);
    }
    return null;
  }
}
