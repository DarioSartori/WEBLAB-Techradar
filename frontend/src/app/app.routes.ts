import { Routes } from '@angular/router';
import { RadarViewerComponent } from './radar-viewer/radar-viewer.component';
import { AdminListComponent } from './admin/admin-list.component';
import { TechnologyEditPage } from './admin/technology-edit.page';
import { AdminLoginPage } from './auth/admin-login.page';
import { ViewerLoginPage } from './auth/viewer-login.page';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'viewer', pathMatch: 'full' },
  { path: 'login', component: ViewerLoginPage },
  { path: 'viewer', component: RadarViewerComponent, canActivate: [authGuard] },
  { path: 'admin/login', component: AdminLoginPage },
  {
    path: 'admin/technologies',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CTO', 'TECH_LEAD'] },
    children: [
      { path: '', component: AdminListComponent },
      { path: 'new', component: TechnologyEditPage },
      { path: ':id/edit', component: TechnologyEditPage },
    ],
  },

  { path: '**', redirectTo: '' },
];
