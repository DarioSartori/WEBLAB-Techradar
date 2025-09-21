import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Tech = {
  id: string;
  name: string;
  category: 'Techniques' | 'Platforms' | 'Tools' | 'LanguagesFrameworks';
  ring?: 'Assess' | 'Trial' | 'Adopt' | 'Hold';
  techDescription: string;
  ringDescription?: string;
  publishedAt?: string | null;
};

@Injectable({ providedIn: 'root' })
export class TechnologiesApi {
  private http = inject(HttpClient);
  list(status: 'draft' | 'published' | 'all' = 'all') {
    return this.http.get<Tech[]>(`/api/technologies`, { params: { status } });
  }
  get(id: string) {
    return this.http.get<Tech>(`/api/technologies/${id}`);
  }
  create(body: {
    name: string;
    category: string;
    techDescription: string;
    ring?: string;
    ringDescription?: string;
  }) {
    return this.http.post<Tech>('/api/technologies', body);
  }
  update(id: string, body: Partial<Tech>) {
    return this.http.patch<Tech>(`/api/technologies/${id}`, body);
  }
  publish(id: string, body: { ring: Tech['ring']; ringDescription: string }) {
    return this.http.patch<Tech>(`/api/technologies/${id}/publish`, body);
  }
}
