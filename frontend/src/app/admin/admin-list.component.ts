import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TechnologiesApi, Tech } from '../services/technologies.api';

type Ring = 'Assess' | 'Trial' | 'Adopt' | 'Hold' | '';
type NonEmptyRing = Exclude<Ring, ''>;

@Component({
  standalone: true,
  selector: 'app-admin-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit {
  private readonly api = inject(TechnologiesApi);
  private readonly router = inject(Router);

  filter: 'draft' | 'published' | 'all' = 'all';
  list: Tech[] = [];

  publishing: Tech | null = null;
  publishForm: {
    ring: '' | NonNullable<Tech['ring']>;
    ringDescription: string;
  } = {
    ring: '',
    ringDescription: '',
  };

  reclassifying: Tech | null = null;
  reclassifyForm: {
    ring: '' | NonNullable<Tech['ring']>;
    ringDescription: string;
  } = {
    ring: '',
    ringDescription: '',
  };

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.list(this.filter).subscribe((d: Tech[]) => (this.list = d));
  }

  toggle(filter: 'draft' | 'published' | 'all') {
    this.filter = filter;
    this.load();
  }

  new() {
    this.router.navigateByUrl('/admin/technologies/new');
  }

  edit(t: Tech) {
    this.router.navigate(['/admin/technologies', t.id, 'edit']);
  }

  openPublish(t: Tech) {
    if (t.publishedAt) return;
    this.publishing = t;
    this.publishForm = {
      ring: (t.ring ?? '') as Ring,
      ringDescription: t.ringDescription ?? '',
    };
  }

  confirmPublish() {
    const t = this.publishing;
    const f = this.publishForm;
    if (!t || !f.ring || !f.ringDescription) return;

    this.api
      .publish(t.id, { ring: f.ring, ringDescription: f.ringDescription })
      .subscribe(() => {
        this.cancelPublish();
        this.load();
      });
  }

  cancelPublish() {
    this.publishing = null;
    this.publishForm = { ring: '', ringDescription: '' };
  }

  openReclassify(t: Tech) {
    if (!t.publishedAt) return;
    this.reclassifying = t;
    this.reclassifyForm = {
      ring: (t.ring ?? '') as any,
      ringDescription: t.ringDescription ?? '',
    };
  }

  confirmReclassify() {
    const t = this.reclassifying;
    const f = this.reclassifyForm;
    if (!t || !f.ring || !f.ringDescription) return;

    this.api
      .reclassify(t.id, { ring: f.ring, ringDescription: f.ringDescription })
      .subscribe(() => {
        this.cancelReclassify();
        this.load();
      });
  }

  cancelReclassify() {
    this.reclassifying = null;
    this.reclassifyForm = { ring: '', ringDescription: '' };
  }
}
