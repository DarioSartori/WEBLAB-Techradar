import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TechnologiesApi } from '../services/technologies.api';
import { TechnologyFormComponent } from './technology-form.component';

interface Tech {
  id: string;
  name: string;
  category: 'Techniques' | 'Platforms' | 'Tools' | 'LanguagesFrameworks';
  ring?: 'Assess' | 'Trial' | 'Adopt' | 'Hold';
  techDescription: string;
  ringDescription?: string;
  publishedAt?: string | null;
}

type TechUpsertDto = Omit<Tech, 'id'>;

@Component({
  standalone: true,
  imports: [CommonModule, TechnologyFormComponent],
  templateUrl: './technology-edit.page.html',
  styleUrls: ['./technology-edit.page.scss'],
})
export class TechnologyEditPage implements OnInit {
  private readonly api = inject(TechnologiesApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  
  isNew = !this.route.snapshot.paramMap.get('id');
  data: Tech | null = null;
  published = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id)
      this.api.get(id).subscribe((d: Tech) => {
        this.data = d;
        this.published = !!d.publishedAt;
      });
  }
  onSave(v: TechUpsertDto) {
    const id = this.route.snapshot.paramMap.get('id');
    const req = id ? this.api.update(id, v) : this.api.create(v);
    req.subscribe(() => this.router.navigateByUrl('/admin/technologies'));
  }
}
