import { Injectable } from '@angular/core';
import { DynamicFilterService } from '../dynamic-filter/dynamic-filter.service';
import { EListTable } from '../../models/enum.tables';

@Injectable({
  providedIn: 'root'
})
export class BranchOfficesService extends DynamicFilterService {

  constructor() {

    super(EListTable.branchOffices,['name', 'description']);
  }
}
