import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Tech {
  id: string;
  name: string;
  category: 'Techniques' | 'Platforms' | 'Tools' | 'LanguagesFrameworks';
  ring: 'Assess' | 'Trial' | 'Adopt' | 'Hold';
}
type Grouped = Record<Tech['category'], Record<Tech['ring'], Tech[]>>;

@Component({
  selector: 'app-radar-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar-viewer.component.html',
  styleUrls: ['./radar-viewer.component.scss'],
})
export class RadarViewerComponent implements OnInit {
  data: Grouped = {
    Techniques: { Assess: [], Trial: [], Adopt: [], Hold: [] },
    Platforms: { Assess: [], Trial: [], Adopt: [], Hold: [] },
    Tools: { Assess: [], Trial: [], Adopt: [], Hold: [] },
    LanguagesFrameworks: { Assess: [], Trial: [], Adopt: [], Hold: [] },
  };
  loading = true;
  error = '';
  totalCount = 0;

  readonly categories: Tech['category'][] = [
    'Techniques',
    'Platforms',
    'Tools',
    'LanguagesFrameworks',
  ];
  readonly rings: Tech['ring'][] = ['Assess', 'Trial', 'Adopt', 'Hold'];

  private readonly http = inject(HttpClient);

  ngOnInit() {
    this.http.get<Tech[]>('/api/radar').subscribe({
      next: (items) => {
        this.data = this.group(items);
        this.totalCount = items.length;
        this.loading = false;
      },
      error: () => {
        this.error = 'Loading failed';
        this.loading = false;
      },
    });
  }

  private group(items: Tech[]): Grouped {
    const g: Grouped = {
      Techniques: { Assess: [], Trial: [], Adopt: [], Hold: [] },
      Platforms: { Assess: [], Trial: [], Adopt: [], Hold: [] },
      Tools: { Assess: [], Trial: [], Adopt: [], Hold: [] },
      LanguagesFrameworks: { Assess: [], Trial: [], Adopt: [], Hold: [] },
    };
    for (const t of items) g[t.category][t.ring].push(t);
    return g;
  }

  categoryClass(cat: Tech['category']) {
    return `chip--${cat}`;
  }
  ringClass(r: Tech['ring']) {
    return `ring--${r}`;
  }
  catLabel(cat: Tech['category']) {
    return cat === 'LanguagesFrameworks' ? 'Languages & Frameworks' : cat;
  }
}
