import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

const STORAGE_KEY = 'prosozial.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly _user = signal<User | null>(this.readStoredUser());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  login(email: string, password: string): { ok: boolean; error?: string } {
    if (!email || !password) {
      return { ok: false, error: 'Email and password are required.' };
    }
    if (password.length < 4) {
      return { ok: false, error: 'Password must be at least 4 characters.' };
    }
    const user: User = {
      email,
      name: email.split('@')[0] ?? email,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
    };
    this._user.set(user);
    this.writeStoredUser(user);
    return { ok: true };
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/']);
  }

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private writeStoredUser(user: User): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }
}
