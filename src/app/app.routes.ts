import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  // ===== Public-facing site (header + footer wrap) =====
  {
    path: '',
    loadComponent: () => import('./shell/public-shell').then((m) => m.PublicShell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
      },
      {
        path: 'seminars',
        loadComponent: () => import('./pages/seminars/seminars-list').then((m) => m.SeminarsList),
      },
      {
        path: 'seminars/lecturers',
        loadComponent: () => import('./pages/seminars/lecturers-list').then((m) => m.LecturersList),
      },
      // Read-only detail view (must come BEFORE the edit route so
      // /seminars/lecturers/:id matches this one, not the edit one).
      {
        path: 'seminars/lecturers/:id',
        loadComponent: () => import('./pages/seminars/lecturer-detail').then((m) => m.LecturerDetail),
      },
      {
        path: 'seminars/lecturers/new/edit',
        loadComponent: () => import('./pages/seminars/lecturer-edit').then((m) => m.LecturerEdit),
      },
      {
        path: 'seminars/lecturers/:id/edit',
        loadComponent: () => import('./pages/seminars/lecturer-edit').then((m) => m.LecturerEdit),
      },
      {
        path: 'seminars/new/edit',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./pages/seminars/seminar-edit').then((m) => m.SeminarEdit),
      },
      {
        path: 'seminars/:id/edit',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./pages/seminars/seminar-edit').then((m) => m.SeminarEdit),
      },
      {
        path: 'seminars/:id',
        loadComponent: () => import('./pages/seminars/seminar-detail').then((m) => m.SeminarDetail),
      },
      {
        path: 'unserbeitrag',
        loadComponent: () => import('./pages/unser-beitrag/unser-beitrag').then((m) => m.UnserBeitrag),
      },
      {
        path: 'verantwortung',
        loadComponent: () => import('./pages/verantwortung/verantwortung').then((m) => m.Verantwortung),
      },
      {
        path: 'ueber-uns',
        loadComponent: () => import('./pages/uber-uns/uber-uns').then((m) => m.UberUns),
      },
    ],
  },

  // ===== Authenticated app (admin dashboard) =====
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./admin/admin').then((m) => m.Admin),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'header-navigation' },
          {
            // Friendly URL: /admin/header-navigation → opens the Header/Nav editor
            path: ':section',
            loadComponent: () => import('./admin/admin').then((m) => m.Admin),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
