import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/start-page/start-page.component').then(m => m.StartPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'user-main',
    loadComponent: () => import('./components/user-main/user-main.component').then(m => m.UserMainComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin-main',
    loadComponent: () => import('./components/admin-main/admin-main.component').then(m => m.AdminMainComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'character/new',
    loadComponent: () => import('./components/character-create/character-create.component').then(m => m.CharacterCreateComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'character/:id',
    loadComponent: () => import('./components/character-view/character-view.component').then(m => m.CharacterViewComponent),
    canActivate: [authGuard]
  },
  {
    path: 'character/:id/edit',
    loadComponent: () => import('./components/character-edit/character-edit.component').then(m => m.CharacterEditComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'account-settings',
    loadComponent: () => import('./components/account-settings/account-settings.component').then(m => m.AccountSettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'manage-users',
    loadComponent: () => import('./components/manage-users/manage-users.component').then(m => m.ManageUsersComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

