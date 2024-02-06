import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../../services/services/services.service';
import { IService } from '../../../models/services.interface';
import { ToastrService } from 'ngx-toastr';
import { NgFor, NgIf } from '@angular/common';
import { DetailProvideerService } from '../../../services/detail-provideer/detail-provideer.service';
import { IDynamicDataResponse } from '../../../models/dynamic.table.interface';

@Component({
  selector: 'app-create-update-setting-provideer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    NgIf,
    NgFor,
  ],
  templateUrl: './create-update-setting-provideer.component.html',
  styleUrl: './create-update-setting-provideer.component.scss',
})
export class CreateUpdateSettingProvideerComponent implements OnInit {
  private routerlink = inject(Router);
  private activeRouter = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private ServicesService = inject(ServicesService);
  private detailService = inject(DetailProvideerService);
  private toast = inject(ToastrService);

  idProvideer: string | null = null;
  id: string | null = null;
  configurationForm: FormGroup;
  listServices: IService[] = [];
  titleButtonSave = 'Crear Regla';

  constructor() {
    this.configurationForm = this.fb.group({
      provideer: ['', Validators.required],
      service: ['', Validators.required],
      code: ['', Validators.required],
    });
  }
  async ngOnInit(): Promise<void> {
    await this.getAllServices();
    this.idProvideer =
      this.activeRouter.snapshot.paramMap.get('idProvideer') || null;
    this.id = this.activeRouter.snapshot.paramMap.get('id') || null;
    if (this.idProvideer) {
      this.configurationForm.patchValue({
        provideer: this.idProvideer,
      });
    }

    if (this.id) {
      this.titleButtonSave = 'Actualizar Regla';
    }
  }

  getAllServices() {
    return new Promise<void>((resolve, reject) => {
      this.ServicesService.filter({})
        .then((response: IDynamicDataResponse<IService>) => {
          this.listServices = response.data;
          resolve();
        })
        .catch((error: any) => {
          this.toast.error('Error Get Services', 'Error');
          console.error(error);
          reject();
        });
    });
  }
  actionButtonSave() {
    if (this.id) {
      this.update();
    } else {
      this.saveConfiguration();
    }
  }

  update() {}
  saveConfiguration() {
    const body = this.configurationForm.value;
    this.detailService
      .create(body)
      .then((response) => {
        this.toast.success('Configuración Creada', 'Operación Exitosa');
        this.routerlink.navigate([
          '/admin/provideer/detail/' + this.idProvideer,
        ]);
      })
      .then((error) => {
        this.toast.error('Error Al Crear Configuración', 'Error');
        this.routerlink.navigate([
          '/admin/provideer/detail/' + this.idProvideer,
        ]);
      });
  }

  returnNewDate() {
    const date = new Date();
    return date;
  }
}
