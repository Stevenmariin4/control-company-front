import { Injectable } from '@angular/core';
import { DynamicFilterService } from '../dynamic-filter/dynamic-filter.service';

@Injectable({
  providedIn: 'root',
})
export class TypeServiceService extends DynamicFilterService {
  constructor() {
    super('typeService', ['name', 'description']);
  }
}
