import { TestBed } from '@angular/core/testing';
import { TechnologyEditPage } from './technology-edit.page';
import { TechnologiesApi, Tech } from '../services/technologies.api';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('TechnologyEditPage', () => {
  it('Create mode: shows classification fields', async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyEditPage],
      providers: [
        { provide: TechnologiesApi, useValue: { create: jest.fn().mockReturnValue(of({} as Tech)) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TechnologyEditPage);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#ring'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('button[type="submit"]'))).toBeTruthy();
  });

  it('Edit mode: hides classification fields', async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyEditPage],
      providers: [
        { provide: TechnologiesApi, useValue: { get: jest.fn().mockReturnValue(of({ id: '1', name: 'A', category: 'Tools', techDescription: 'd' } as any)), update: jest.fn().mockReturnValue(of({} as Tech)) } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id','1']]) } } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TechnologyEditPage);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#ring'))).toBeFalsy();
  });
});
