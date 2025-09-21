import { TestBed } from '@angular/core/testing';
import { TechnologyFormComponent } from './technology-form.component';

describe('TechnologyFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TechnologyFormComponent] }).compileComponents();
  });

  it('patches initial Values', () => {
    const fixture = TestBed.createComponent(TechnologyFormComponent);
    const cmp = fixture.componentInstance;
    cmp.initial = {
      name: 'ArgoCD', category: 'Tools', ring: 'Trial',
      techDescription: 'desc', ringDescription: 'why'
    };
    fixture.detectChanges();
    const value = cmp.form.value;
    expect(value.name).toBe('ArgoCD');
    expect(value.ring).toBe('Trial');
  });

  it('sets required when published=true for ring & ringDescription', () => {
    const fixture = TestBed.createComponent(TechnologyFormComponent);
    const cmp = fixture.componentInstance;
    cmp.published = true;
    fixture.detectChanges();

    const ringCtrl = cmp.form.get('ring')!;
    const descCtrl = cmp.form.get('ringDescription')!;
    ringCtrl.setValue(''); descCtrl.setValue('');
    expect(ringCtrl.valid).toBe(false);
    expect(descCtrl.valid).toBe(false);

    ringCtrl.setValue('Trial'); descCtrl.setValue('ok');
    expect(ringCtrl.valid).toBe(true);
    expect(descCtrl.valid).toBe(true);
  });
});
