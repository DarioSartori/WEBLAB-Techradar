import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RadarViewerComponent } from './radar-viewer.component';

describe('RadarViewerComponent', () => {
  it('grouped by category and ring', () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RadarViewerComponent],
    });
    const fixture = TestBed.createComponent(RadarViewerComponent);
    const http = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    http.expectOne('/api/radar').flush([
      { id:'1', name:'ArgoCD', category:'Tools', ring:'Trial' },
      { id:'2', name:'Kubernetes', category:'Platforms', ring:'Adopt' },
    ]);

    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    expect(html.textContent).toContain('Tools');
    expect(html.textContent).toContain('Trial');
    expect(html.textContent).toContain('ArgoCD');
  });
});
