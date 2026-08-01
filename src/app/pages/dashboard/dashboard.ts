import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Icon],
  template: `
    <section class="dashboard">
      <header>
        <span class="eyebrow">Dashboard</span>
        <h1>{{ greeting() }}</h1>
        @if (user(); as u) {
          <p class="role">Angemeldet als <strong>{{ u.email }}</strong> · Rolle: <code>{{ u.role }}</code></p>
        }
      </header>

      <div class="cards">
        <article>
          <div class="ic"><app-icon name="check" [size]="22" /></div>
          <h3>Routen</h3>
          <p>Multi-Page-Navigation mit <code>provideRouter</code> und lazy standalone-Komponenten.</p>
        </article>
        <article>
          <div class="ic"><app-icon name="shield-check" [size]="22" /></div>
          <h3>Auth-Stub</h3>
          <p>Signal-basierter <code>AuthService</code> mit Guard, der nicht eingeloggte Besucher auf <code>/login</code> umleitet.</p>
        </article>
        <article>
          <div class="ic"><app-icon name="globe" [size]="22" /></div>
          <h3>HTTP bereit</h3>
          <p><code>HttpClient</code> ist via <code>provideHttpClient()</code> in <code>app.config.ts</code> vorbereitet.</p>
        </article>
        <article>
          <div class="ic"><app-icon name="sparkle" [size]="22" /></div>
          <h3>Design-System</h3>
          <p>Markenfarbe <code>#007F41</code>, Typografie, Spacing, Komponenten — zentral in <code>styles.scss</code>.</p>
        </article>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; padding: var(--space-6); max-width: 1100px; margin: 0 auto; }
    .dashboard header { margin-bottom: var(--space-8); }
    .dashboard h1 { margin: var(--space-3) 0 var(--space-2); }
    .role { color: var(--color-ink-500); margin: 0; }
    .role code { background: var(--color-brand-50); color: var(--color-primary); padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-4); }
    article { background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-5); }
    article h3 { font-size: var(--fs-lg); margin: var(--space-3) 0 var(--space-2); }
    article p { color: var(--color-ink-500); font-size: var(--fs-sm); margin: 0; }
    article code { background: var(--color-ink-50); padding: 1px 5px; border-radius: 3px; font-size: 0.85em; }
    .ic {
      width: 40px; height: 40px;
      border-radius: var(--radius-md);
      background: var(--color-brand-50);
      color: var(--color-primary);
      display: grid; place-items: center;
    }
  `],
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  readonly user = this.auth.user;
  readonly greeting = computed(() => {
    const u = this.user();
    return u ? `Willkommen zurück, ${u.name}!` : 'Willkommen!';
  });
}
