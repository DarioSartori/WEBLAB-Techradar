import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminListComponent } from './admin-list.component';
import { TechnologiesApi, Tech } from '../services/technologies.api';

describe('AdminListComponent', () => {
  it('openPublish loads ringDescription and fills Dialog', async () => {
    const tech: Tech = {
      id: '1',
      name: 'ArgoCD',
      category: 'Tools',
      ring: 'Adopt',
      ringDescription: 'Description',
      techDescription: 'desc',
      publishedAt: null,
    };

    const apiMock: Partial<TechnologiesApi> = {
      list: () => of([tech]),
      get: () => of(tech),
      publish: (
        id: string,
        body: { ring: Tech['ring']; ringDescription: string }
      ) =>
        of({
          ...tech,
          ring: body.ring,
          ringDescription: body.ringDescription,
          publishedAt: new Date().toISOString(),
        } as Tech),
    };

    await TestBed.configureTestingModule({
      imports: [AdminListComponent],
      providers: [{ provide: TechnologiesApi, useValue: apiMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminListComponent);
    const cmp = fixture.componentInstance;

    cmp.openPublish(tech);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(cmp.pub.ring).toBe('Adopt');
    expect(cmp.pub.ringDescription).toBe('Description');

    cmp.pub = { ring: 'Trial', ringDescription: 'New' };
    cmp['publishing'] = tech;
    cmp.doPublish();
  });
});
