import { TestBed } from '@angular/core/testing';

import { MyAccountSettingsService } from './my-account-settings.service';

describe('MyAccountSettingsService', () => {
  let service: MyAccountSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyAccountSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
