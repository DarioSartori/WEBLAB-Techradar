import { TestBed } from '@angular/core/testing';
import { TechnologyFormComponent } from './technology-form.component';
import { By } from '@angular/platform-browser';

describe('TechnologyFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyFormComponent],
    }).compileComponents();
  });

  it('renders required base fields', () => {
    const fixture = TestBed.createComponent(TechnologyFormComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('#name'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#category'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#techDescription'))).toBeTruthy();
  });

  it('shows classification fields when enabled', () => {
    const fixture = TestBed.createComponent(TechnologyFormComponent);
    const comp = fixture.componentInstance;
    comp.showClassificationFields = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#ring'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#ringDescription'))).toBeTruthy();
  });

  it('hides classification fields when disabled', () => {
    const fixture = TestBed.createComponent(TechnologyFormComponent);
    const comp = fixture.componentInstance;
    comp.showClassificationFields = false;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#ring'))).toBeFalsy();
  });

  it('emits only filled classification fields', () => {
    const fixture = TestBed.createComponent(TechnologyFormComponent);
    const comp = fixture.componentInstance;
    comp.showClassificationFields = true;
    fixture.detectChanges();

    comp.form.patchValue({
      name: 'ArgoCD',
      category: 'Tools',
      techDescription: 'GitOps CD',
      ring: 'Adopt',
      ringDescription: ''
    });

    let emitted: any | undefined;
    comp.save.subscribe(v => (emitted = v));
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', {});

    expect(emitted).toEqual({
      name: 'ArgoCD',
      category: 'Tools',
      techDescription: 'GitOps CD',
      ring: 'Adopt',
    });
  });

  it('blocks submit when required base fields are missing', () => {
    const fixture = TestBed.createComponent(TechnologyFormComponent);
    const comp = fixture.componentInstance;
    comp.showClassificationFields = true;
    fixture.detectChanges();

    comp.form.patchValue({ name: '', category: '', techDescription: '' });
    let emitted = false;
    comp.save.subscribe(() => (emitted = true));
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', {});
    expect(emitted).toBe(false);
  });
});
