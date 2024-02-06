import { TestBed } from '@angular/core/testing';

import { SalesDailyService } from './sales-daily.service';

describe('SalesDailyService', () => {
  let service: SalesDailyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesDailyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
