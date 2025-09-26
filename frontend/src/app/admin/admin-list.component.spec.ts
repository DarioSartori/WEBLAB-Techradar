import { TestBed } from '@angular/core/testing';
import { AdminListComponent } from './admin-list.component';
import { TechnologiesApi, Tech } from '../services/technologies.api';
import { of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

function makeApiMock(listData: Tech[] = []) {
  const publish$ = new Subject<Tech>();
  const reclassify$ = new Subject<Tech>();
  return {
    list: jest.fn().mockReturnValue(of(listData)),
    publish: jest.fn().mockImplementation((_id, _dto) => publish$.asObservable()),
    reclassify: jest.fn().mockImplementation((_id, _dto) => reclassify$.asObservable()),
    __streams: { publish$, reclassify$ }
  } as unknown as Partial<TechnologiesApi> & { __streams: any };
}

describe('AdminListComponent', () => {
  it('shows empty state when list is empty', async () => {
    const api = makeApiMock([]);

    await TestBed.configureTestingModule({
      imports: [AdminListComponent, RouterTestingModule],
      providers: [{ provide: TechnologiesApi, useValue: api }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminListComponent);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.empty-state'))).toBeTruthy();
  });

  it('renders a row with Draft badge and shows Publish action', async () => {
    const api = makeApiMock([{ id: 't1', name: 'A', category: 'Tools', techDescription: 'd', publishedAt: null } as any]);

    await TestBed.configureTestingModule({
      imports: [AdminListComponent, RouterTestingModule],
      providers: [{ provide: TechnologiesApi, useValue: api }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminListComponent);
    fixture.detectChanges();

    const row = fixture.debugElement.query(By.css('tbody tr'));
    expect(row).toBeTruthy();

    const badge = row.query(By.css('.badge')).nativeElement as HTMLElement;
    expect(badge.textContent).toContain('Draft');

    const actions = row.queryAll(By.css('.actions .btn'));
    expect(actions.length).toBeGreaterThan(1);
    expect((actions[1].nativeElement as HTMLButtonElement).textContent).toContain('Publish');
  });

  it('opens Publish modal and disables primary until both fields filled', async () => {
    const api = makeApiMock([{ id: 't1', name: 'A', category: 'Tools', techDescription: 'd', publishedAt: null } as any]);

    await TestBed.configureTestingModule({
      imports: [AdminListComponent, RouterTestingModule],
      providers: [{ provide: TechnologiesApi, useValue: api }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminListComponent);
    fixture.detectChanges();

    fixture.debugElement.queryAll(By.css('tbody .actions .btn'))[1].triggerEventHandler('click', {});
    fixture.detectChanges();

    const primary = fixture.debugElement.query(By.css('.modal .btn-primary'));
    expect(primary.properties['disabled']).toBe(true);

    const select = fixture.debugElement.query(By.css('.modal select')).nativeElement as HTMLSelectElement;
    select.value = 'Trial'; select.dispatchEvent(new Event('change'));
    const ta = fixture.debugElement.query(By.css('.modal textarea')).nativeElement as HTMLTextAreaElement;
    ta.value = 'why'; ta.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.modal .btn-primary')).properties['disabled']).toBe(false); // <- war: toBeFalse()
  });

  it('opens Reclassify modal for published tech', async () => {
    const api = makeApiMock([{ id: 't2', name: 'B', category: 'Tools', techDescription: 'd', publishedAt: '2024-01-01T00:00:00Z', ring: 'Trial' } as any]);

    await TestBed.configureTestingModule({
      imports: [AdminListComponent, RouterTestingModule],
      providers: [{ provide: TechnologiesApi, useValue: api }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminListComponent);
    fixture.detectChanges();

    const btns = fixture.debugElement.queryAll(By.css('tbody .actions .btn'));
    const reclassBtn = btns.find(b => (b.nativeElement as HTMLButtonElement).textContent?.includes('Change classification'))!;
    reclassBtn.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.modal h3'))?.nativeElement.textContent).toContain('Change classification');
  });
});
