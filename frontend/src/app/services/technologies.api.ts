import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Tech {
  id: string;
  name: string;
  category: 'Techniques' | 'Platforms' | 'Tools' | 'LanguagesFrameworks';
  ring?: 'Assess' | 'Trial' | 'Adopt' | 'Hold';
  techDescription: string;
  ringDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TechnologiesApi {
  private readonly http = inject(HttpClient);

  list(status: 'draft' | 'published' | 'all' = 'all') {
    return this.http.get<Tech[]>(`/api/technologies`, { params: { status } });
  }

  get(id: string) {
    return this.http.get<Tech>(`/api/technologies/${id}`);
  }

  create(body: {
    name: string;
    category: Tech['category'];
    techDescription: string;
    ring?: Exclude<Tech['ring'], undefined>;
    ringDescription?: string;
  }) {
    return this.http.post<Tech>('/api/technologies', body);
  }

  update(
    id: string,
    body: Partial<Pick<Tech, 'name' | 'category' | 'techDescription'>>
  ) {
    return this.http.patch<Tech>(`/api/technologies/${id}`, body);
  }

  publish(
    id: string,
    body: { ring: NonNullable<Tech['ring']>; ringDescription: string }
  ) {
    return this.http.patch<Tech>(`/api/technologies/${id}/publish`, body);
  }

  reclassify(
    id: string,
    body: { ring: NonNullable<Tech['ring']>; ringDescription: string }
  ) {
    return this.http.patch<Tech>(`/api/technologies/${id}/reclassify`, body);
  }
}
