import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <section class="profile">
      <h1>Profil</h1>
      @if (user(); as u) {
        <dl>
          <dt>Name</dt><dd>{{ u.name }}</dd>
          <dt>E-Mail</dt><dd>{{ u.email }}</dd>
          <dt>Rolle</dt><dd><code>{{ u.role }}</code></dd>
        </dl>
      } @else {
        <p>Nicht angemeldet.</p>
      }
    </section>
  `,
  styles: [`
    :host { display: block; padding: var(--space-6); max-width: 720px; margin: 0 auto; }
    h1 { margin: 0 0 var(--space-4); }
    dl { display: grid; grid-template-columns: max-content 1fr; gap: var(--space-3) var(--space-5); background: #fff; padding: var(--space-5) var(--space-6); border: 1px solid var(--color-border); border-radius: var(--radius-lg); margin: 0; }
    dt { font-weight: 600; color: var(--color-ink-500); }
    dd { margin: 0; color: var(--color-ink-900); }
    code { background: var(--color-brand-50); color: var(--color-primary); padding: 2px 6px; border-radius: 4px; }
  `],
})
export class Profile {
  private readonly auth = inject(AuthService);
  readonly user = this.auth.user;
}
