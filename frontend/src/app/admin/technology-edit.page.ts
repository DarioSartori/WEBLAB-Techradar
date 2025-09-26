import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TechnologyFormComponent } from './technology-form.component';
import { TechnologiesApi, Tech } from '../services/technologies.api';

@Component({
  standalone: true,
  selector: 'app-technology-edit-page',
  imports: [CommonModule, TechnologyFormComponent],
  templateUrl: './technology-edit.page.html',
  styleUrls: ['./technology-edit.page.scss'],
})
export class TechnologyEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(TechnologiesApi);

  mode: 'create' | 'edit' = 'create';
  tech: Tech | null = null;
  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.mode = id ? 'edit' : 'create';

    if (this.mode === 'edit' && id) {
      this.api.get(id).subscribe({
        next: (t) => {
          this.tech = t;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    } else {
      this.loading = false;
    }
  }

  create(payload: {
    name: string;
    category: Tech['category'];
    techDescription: string;
    ring?: NonNullable<Tech['ring']>;
    ringDescription?: string;
  }) {
    const body: any = {
      name: payload.name,
      category: payload.category,
      techDescription: payload.techDescription,
    };

    const ring = (payload.ring ?? '').toString().trim();
    if (ring) body.ring = ring;
    const rdesc = (payload.ringDescription ?? '').toString().trim();
    if (rdesc) body.ringDescription = rdesc;

    this.api.create(body).subscribe({
      next: () => this.router.navigate(['/admin/technologies']),
    });
  }

  update(
    payload: Partial<Pick<Tech, 'name' | 'category' | 'techDescription'>>
  ) {
    if (!this.tech) return;
    this.api.update(this.tech.id, payload).subscribe({
      next: () => this.router.navigate(['/admin/technologies']),
    });
  }
}
