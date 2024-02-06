import { TestBed } from '@angular/core/testing';

import { DetailProvideerService } from './detail-provideer.service';

describe('DetailProvideerService', () => {
  let service: DetailProvideerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailProvideerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
