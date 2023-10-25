import { TestBed } from '@angular/core/testing';

import { SubcontractTrackingService } from './subcontract-tracking.service';

describe('SubcontractTrackingService', () => {
  let service: SubcontractTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubcontractTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
