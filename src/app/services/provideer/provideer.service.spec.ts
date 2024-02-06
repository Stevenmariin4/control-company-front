import { TestBed } from '@angular/core/testing';

import { ProvideerService } from './provideer.service';

describe('ProvideerService', () => {
  let service: ProvideerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvideerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
