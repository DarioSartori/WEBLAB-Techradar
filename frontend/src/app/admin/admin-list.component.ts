import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TechnologiesApi, Tech } from '../services/technologies.api';

type Ring = 'Assess' | 'Trial' | 'Adopt' | 'Hold' | '';

@Component({
  standalone: true,
  selector: 'app-admin-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent {
  private api = inject(TechnologiesApi);
  private router = inject(Router);

  list: Tech[] = [];
  filter: 'draft' | 'published' | 'all' = 'all';

  publishing: Tech | null = null;
  pub: { ring: Ring; ringDescription: string } = {
    ring: '',
    ringDescription: '',
  };

  rings: Exclude<Ring, ''>[] = ['Assess', 'Trial', 'Adopt', 'Hold'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.list(this.filter).subscribe((d) => (this.list = d));
  }

  new() {
    this.router.navigateByUrl('/admin/technologies/new');
  }

  edit(t: Tech) {
    this.router.navigate(['/admin/technologies', t.id, 'edit']);
  }

  openPublish(t: Tech) {
    this.publishing = t;
    this.pub = {
      ring: (t.ring ?? '') as Ring,
      ringDescription: t.ringDescription ?? '',
    };

    this.api.get(t.id).subscribe((full) => {
      this.pub.ring = (full.ring ?? '') as any;
      this.pub.ringDescription = full.ringDescription ?? '';
    });
  }

  doPublish() {
    if (!this.publishing || !this.pub.ring || !this.pub.ringDescription) return;
    this.api
      .publish(this.publishing.id, {
        ring: this.pub.ring as Exclude<Ring, ''>,
        ringDescription: this.pub.ringDescription,
      })
      .subscribe(() => {
        this.publishing = null;
        this.pub = { ring: '', ringDescription: '' };
        this.load();
      });
  }
}
