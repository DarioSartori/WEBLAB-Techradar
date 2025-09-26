import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TechnologiesApi } from './technologies.api';

describe('TechnologiesApi', () => {
  let api: TechnologiesApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TechnologiesApi],
    });
    api = TestBed.inject(TechnologiesApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());
  
  it('publish calls PATCH /publish', () => {
    api.publish('id1', { ring: 'Trial', ringDescription: 'why' }).subscribe();
    const req = http.expectOne('/api/technologies/id1/publish');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ ring: 'Trial', ringDescription: 'why' });
    req.flush({});
  });

  it('reclassify calls PATCH /reclassify', () => {
    api.reclassify('id1', { ring: 'Adopt', ringDescription: 'mature' }).subscribe();
    const req = http.expectOne('/api/technologies/id1/reclassify');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });
});
