import { Component, inject, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Tech {
  id: string;
  name: string;
  category: 'Techniques' | 'Platforms' | 'Tools' | 'LanguagesFrameworks';
  ring: 'Assess' | 'Trial' | 'Adopt' | 'Hold';
}
type Grouped = Record<string, Record<string, Tech[]>>;

@Component({
  selector: 'app-radar-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar-viewer.component.html',
  styleUrl: './radar-viewer.component.scss',
})
export class RadarViewerComponent implements OnInit{
  data: Grouped = {};
  loading = true;
  error = '';

  private readonly http = inject(HttpClient);

  ngOnInit() {
    this.http.get<Tech[]>('/api/radar').subscribe({
      next: (items) => {
        this.data = this.group(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Loading failed';
        this.loading = false;
      },
    });
  }

  private group(items: Tech[]): Grouped {
    const categories = [
      'Techniques',
      'Platforms',
      'Tools',
      'LanguagesFrameworks',
    ] as const;
    const rings = ['Assess', 'Trial', 'Adopt', 'Hold'] as const;
    const g: Grouped = {};
    for (const c of categories) {
      g[c] = {};
      for (const r of rings) g[c][r] = [];
    }
    for (const t of items) {
      g[t.category][t.ring].push(t);
    }
    return g;
  }
}
