import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if route requires ONLY admin (manage-users)
  if (route.routeConfig?.path === 'manage-users') {
    if (authService.isOnlyAdmin()) {
      return true;
    }
    router.navigate(['/admin-main']);
    return false;
  }

  // For other admin routes (edit, delete, create)
  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/user-main']);
  return false;
};

