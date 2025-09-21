import { Routes } from '@angular/router';
import { AdminListComponent } from './admin/admin-list.component';
import { TechnologyEditPage } from './admin/technology-edit.page';
import { RadarViewerComponent } from './radar-viewer/radar-viewer.component';

export const routes: Routes = [
  { path: 'viewer', component: RadarViewerComponent },
  { path: 'admin/technologies', component: AdminListComponent },
  { path: 'admin/technologies/new', component: TechnologyEditPage },
  { path: 'admin/technologies/:id/edit', component: TechnologyEditPage },
  { path: '', pathMatch: 'full', redirectTo: 'viewer' },
];
