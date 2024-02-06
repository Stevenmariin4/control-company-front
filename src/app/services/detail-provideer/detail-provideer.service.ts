import { Injectable } from '@angular/core';
import { DynamicFilterService } from '../dynamic-filter/dynamic-filter.service';
import { EListTable } from '../../models/enum.tables';

@Injectable({
  providedIn: 'root'
})
export class DetailProvideerService  extends DynamicFilterService{
  constructor() {
    super(EListTable.detailProvideer,['code'])
  }
}
