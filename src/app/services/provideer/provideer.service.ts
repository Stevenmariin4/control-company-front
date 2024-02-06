import { Injectable } from '@angular/core';
import { DynamicFilterService } from '../dynamic-filter/dynamic-filter.service';
import { EListTable } from '../../models/enum.tables';

@Injectable({
  providedIn: 'root'
})
export class ProvideerService extends DynamicFilterService {
  
  constructor() {
    super(EListTable.provideer,['name']);
  }

 
}
