import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Icon } from '../shared/icon';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Icon],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/dashboard">
        <img src="logo-white.svg" alt="Prosozial" width="120" height="34" />
      </a>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active">
          <app-icon name="home" [size]="16" /> Dashboard
        </a>
        <a routerLink="/profile" routerLinkActive="active">
          <app-icon name="badge-leaf" [size]="16" /> Profil
        </a>
        @if (isAdmin()) {
          <a routerLink="/admin" routerLinkActive="active">
            <app-icon name="settings" [size]="16" /> Admin
          </a>
        }
      </nav>
      <div class="user">
        @if (user(); as u) {
          <span class="email">{{ u.email }}</span>
          <button type="button" (click)="logout()">
            <app-icon name="arrow-right" [size]="14" /> Logout
          </button>
        }
      </div>
    </header>
    <main class="content">
      <router-outlet />
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100dvh; background: var(--color-bg); }
    .topbar {
      display: flex; align-items: center; gap: var(--space-6);
      padding: 0 var(--space-6);
      background: var(--color-ink-900);
      color: #e2e8f0;
      box-shadow: 0 1px 0 rgba(15, 23, 42, 0.4);
      height: var(--header-h);
      position: sticky; top: 0; z-index: 10;
    }
    .brand img { height: 34px; width: auto; filter: brightness(0) invert(1); }
    nav { display: flex; gap: var(--space-2); flex: 1; }
    nav a {
      display: inline-flex; align-items: center; gap: var(--space-2);
      color: #cbd5e1; text-decoration: none;
      padding: 0.5rem 0.85rem; border-radius: var(--radius-md);
      font-size: var(--fs-sm); font-weight: 500;
      transition: background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out);
    }
    nav a:hover { color: #fff; background: rgba(255,255,255,0.08); }
    nav a.active { color: #fff; background: var(--color-primary); }
    .user { display: flex; align-items: center; gap: var(--space-3); }
    .email { color: #94a3b8; font-size: var(--fs-sm); }
    .user button {
      display: inline-flex; align-items: center; gap: var(--space-2);
      background: transparent; color: #e2e8f0;
      border: 1px solid #334155; border-radius: var(--radius-full);
      padding: 0.4rem 0.85rem; cursor: pointer; font-size: var(--fs-sm);
      transition: background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out);
    }
    .user button:hover { background: #1e293b; border-color: #475569; }
  `],
})
export class Shell {
  private readonly auth = inject(AuthService);
  readonly user = this.auth.user;
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  logout(): void {
    this.auth.logout();
  }
}
