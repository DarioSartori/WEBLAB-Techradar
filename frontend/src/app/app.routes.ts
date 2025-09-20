import { Routes } from '@angular/router';
import { TechnologiesCreateComponent } from './technologies-create/technologies-create.component';
import { RadarViewerComponent } from './radar-viewer/radar-viewer.component';

export const routes: Routes = [
  { path: 'technologies/create', component: TechnologiesCreateComponent },
  { path: 'technologies/viewer', component: RadarViewerComponent },
  { path: '', pathMatch: 'full', redirectTo: 'technologies/viewer' },
];
