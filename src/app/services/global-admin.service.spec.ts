import { TestBed } from '@angular/core/testing';

import { GlobalAdminService } from './global-admin.service';

describe('GlobalAdminService', () => {
  let service: GlobalAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
