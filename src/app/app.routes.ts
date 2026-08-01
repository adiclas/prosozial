import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'seminars',
    loadComponent: () => import('./pages/seminars/seminars-list').then((m) => m.SeminarsList),
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
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
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
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
