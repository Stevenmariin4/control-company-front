import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProvideerService } from '../../../services/provideer/provideer.service';
import { IProvideer } from '../../../models/provideer.interface';
import { ToastrService } from 'ngx-toastr';
import { IDynamicDataResponse } from '../../../models/dynamic.table.interface';
@Component({
  selector: 'app-list-provider',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgOptimizedImage, RouterLink, NgFor],
  templateUrl: './list-provider.component.html',
  styleUrl: './list-provider.component.scss',
})
export class ListProviderComponent implements OnInit {
  private provideerService = inject(ProvideerService);
  public listProvideer: IProvideer[] = [];
  private toast = inject(ToastrService);
  ngOnInit(): void {
    this.getAllProvideer();
  }
 
  getAllProvideer() {
    this.provideerService
      .filter({})
      .then((response: IDynamicDataResponse<IProvideer>) => {
        this.listProvideer = response.data;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error get Provideer', 'Error');
      });
  }
}
