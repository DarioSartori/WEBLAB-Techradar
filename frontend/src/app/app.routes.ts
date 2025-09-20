import { Routes } from '@angular/router';
import { TechnologiesCreateComponent } from './technologies-create/technologies-create.component';

export const routes: Routes = [
  { path: 'technologies/create', component: TechnologiesCreateComponent },
  { path: '', pathMatch: 'full', redirectTo: 'technologies/create' },
];
