import { TestBed } from '@angular/core/testing';

import { RFIsService } from './rfis.service';

describe('RFIsService', () => {
  let service: RFIsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RFIsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
