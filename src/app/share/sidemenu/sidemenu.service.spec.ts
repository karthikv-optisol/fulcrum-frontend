import { TestBed } from '@angular/core/testing';

import { SidemenuService } from './../../services/sidemenu.service';

describe('SidemenuService', () => {
  let service: SidemenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidemenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
