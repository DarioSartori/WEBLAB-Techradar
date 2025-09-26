import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

type Category = 'Techniques' | 'Platforms' | 'Tools' | 'LanguagesFrameworks';
type Ring = 'Assess' | 'Trial' | 'Adopt' | 'Hold';

interface Tech {
  id: string;
  name: string;
  category: Category;
  ring: Ring;
}

type Grouped = Record<Category, Record<Ring, Tech[]>>;

@Component({
  selector: 'app-radar-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar-viewer.component.html',
  styleUrls: ['./radar-viewer.component.scss'],
})
export class RadarViewerComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly categories: Category[] = ['Techniques', 'Platforms', 'Tools', 'LanguagesFrameworks'];
  readonly rings: Ring[] = ['Assess', 'Trial', 'Adopt', 'Hold'];

  data: Grouped = {
    Techniques: { Assess: [], Trial: [], Adopt: [], Hold: [] },
    Platforms: { Assess: [], Trial: [], Adopt: [], Hold: [] },
    Tools: { Assess: [], Trial: [], Adopt: [], Hold: [] },
    LanguagesFrameworks: { Assess: [], Trial: [], Adopt: [], Hold: [] },
  };

  loading = true;
  error = '';
  totalCount = 0;

  ngOnInit(): void {
    this.http.get<Tech[]>('/api/radar').subscribe({
      next: (items) => {
        this.group(items);
        this.totalCount = items.length;
        this.loading = false;
      },
      error: () => {
        this.error = 'Loading failed';
        this.loading = false;
      },
    });
  }

  private group(items: Tech[]) {
    for (const c of this.categories) {
      for (const r of this.rings) this.data[c][r] = [];
    }
    for (const t of items) {
      this.data[t.category][t.ring].push(t);
    }
  }

  catLabel(cat: Category) {
    return cat === 'LanguagesFrameworks' ? 'Languages & Frameworks' : cat;
  }

  ringClass(r: Ring) {
    return 'ring--' + r;
  }

  categoryClass(cat: Category) {
    return 'chip--' + cat;
  }
}
