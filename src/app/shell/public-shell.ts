import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ContentService } from '../core/content.service';
import { AuthService } from '../core/auth.service';
import { Icon } from '../shared/icon';

/**
 * Public-facing shell — wraps every non-authenticated route (home,
 * seminars list, seminar detail, lecturers list, lecturer edit, login)
 * with the marketing site header (top navigation + CTA) and the marketing
 * footer (brand, columns, contact, legal). Centralises the chrome so it
 * never has to be duplicated in each page.
 */
@Component({
  selector: 'app-public-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet, Icon],
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.scss',
})
export class PublicShell {
  private readonly content = inject(ContentService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly header = this.content.header;
  readonly footer = this.content.footer;
  readonly user = this.auth.user;
  readonly isAuthed = computed(() => !!this.user());

  readonly mobileNavOpen = signal(false);

  /**
   * Index of the currently open desktop dropdown, or `null` when none.
   * Only one dropdown can be open at a time. Hover + keyboard focus both
   * open it; clicking the parent button toggles it (for touch devices).
   */
  readonly dropdownOpen = signal<number | null>(null);

  toggleMobileNav(): void {
    this.mobileNavOpen.update((v) => !v);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  openDropdown(i: number): void {
    this.dropdownOpen.set(i);
  }

  closeDropdown(i: number): void {
    if (this.dropdownOpen() === i) this.dropdownOpen.set(null);
  }

  toggleDropdown(i: number): void {
    this.dropdownOpen.update((v) => (v === i ? null : i));
  }

  closeAllDropdowns(): void {
    this.dropdownOpen.set(null);
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}