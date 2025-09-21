import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TechnologiesApi } from '../services/technologies.api';
import { TechnologyFormComponent } from './technology-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, TechnologyFormComponent],
  templateUrl: './technology-edit.page.html',
  styleUrls: ['./technology-edit.page.scss'],
})
export class TechnologyEditPage {
  private api = inject(TechnologiesApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  isNew = !this.route.snapshot.paramMap.get('id');
  data: any;
  published = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id)
      this.api.get(id).subscribe((d) => {
        this.data = d;
        this.published = !!d.publishedAt;
      });
  }
  onSave(v: any) {
    const id = this.route.snapshot.paramMap.get('id');
    const req = id ? this.api.update(id, v) : this.api.create(v);
    req.subscribe(() => this.router.navigateByUrl('/admin/technologies'));
  }
}
