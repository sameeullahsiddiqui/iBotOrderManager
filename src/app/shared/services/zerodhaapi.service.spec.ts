import { TestBed } from '@angular/core/testing';

import { ZerodhaapiService } from './zerodhaapi.service';

describe('ZerodhaapiService', () => {
  let service: ZerodhaapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZerodhaapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
