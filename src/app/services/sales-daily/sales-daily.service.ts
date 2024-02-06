import { Injectable } from '@angular/core';
import { DynamicFilterService } from '../dynamic-filter/dynamic-filter.service';

@Injectable({
  providedIn: 'root'
})
export class SalesDailyService extends DynamicFilterService {
  constructor() {
    super('sales-daily');
  }
}
