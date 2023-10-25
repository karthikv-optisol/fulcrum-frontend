import { TestBed } from '@angular/core/testing';

import { SubmittalService } from './submittal.service';

describe('SubmittalService', () => {
  let service: SubmittalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmittalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
