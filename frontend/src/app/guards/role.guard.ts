import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, Role } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data?.['roles'] as Role[]) || [];
  if (auth.isLoggedIn() && auth.hasAnyRole(roles)) return true;
  router.navigateByUrl('/admin/login');
  return false;
};
