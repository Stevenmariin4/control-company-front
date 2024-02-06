import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TypeServiceService } from '../../../services/type-service/type-service.service';
import { ITypeService } from '../../../models/typeservice.interface';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ThousandSeparatorDirectivePipe } from '../../../pipe/ThousandSeparatorDirective/thousand-separator-directive.pipe';
import { ServicesService } from '../../../services/services/services.service';
import { IService } from '../../../models/services.interface';
import { IDynamicData, IDynamicDataResponse } from '../../../models/dynamic.table.interface';

@Component({
  selector: 'app-create-update-services',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    NgClass,
    ThousandSeparatorDirectivePipe,
  ],
  templateUrl: './create-update-services.component.html',
  styleUrl: './create-update-services.component.scss',
})
export class CreateUpdateServicesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private TypeServiceService = inject(TypeServiceService);
  private toast = inject(ToastrService);
  private routerNavigation = inject(Router);
  private activeRouter = inject(ActivatedRoute);
  private ServicesService = inject(ServicesService);

  private idService: string | null = null;
  titleButtonSave = 'Crear Servicio';
  serviceForm: FormGroup = this.fb.group({
    typeService: ['', Validators.required],
    name: ['', Validators.required],
    amount: ['', Validators.required],
    fee: ['', Validators.required],
  });
  typeServices: ITypeService[] = [];

  ngOnInit(): void {
    this.loadTypeServices();
    this.idService = this.activeRouter.snapshot.paramMap.get('id');
    if (this.idService) {
      this.titleButtonSave = 'Actualizar';
      this.getServiceById();
    }
  }

  getServiceById() {
    if (this.idService)
      this.ServicesService.getById(this.idService).then(
        (response: IDynamicData<IService>) => {
          this.serviceForm.patchValue({
            typeService: response.data.typeService,
            name: response.data.name,
            amount: response.data.amount,
            fee: response.data.fee,
          });
        }
      );
  }

  loadTypeServices(): void {
    // Llama al servicio para obtener los tipos de servicio
    this.TypeServiceService.filter({ fieldToSearch: '' }).then(
      (types: IDynamicDataResponse<ITypeService>) => {
        this.typeServices = types?.data || [];
      },
      (error) => {
        this.toast.error('Error loading type services:', 'Error');
        console.error(error);
      }
    );
  }

  actionButtonSave() {
    if (this.idService) {
      this.update();
    } else {
      this.createService();
    }
  }

  private createService() {
    const body = this.serviceForm.value;
    body.is_valid = true;
    this.ServicesService.create(body)
      .then((response) => {
        this.toast.success('Guardo Exitosamente', 'Operación Realizada');
        this.routerNavigation.navigate(['/admin/services/list']);
      })
      .catch((error) => {
        this.toast.error('Error Create Service', 'Error');
        console.error(error);
      });
  }

  private update() {
    const body = this.serviceForm.value;
    if (this.idService) {
      this.ServicesService.update(this.idService, body)
        .then((response) => {
          this.toast.success('Actualizado Exitosamente', 'Operación Realizada');
          this.routerNavigation.navigate(['/admin/services/list']);
        })
        .catch((error) => {
          this.toast.error('Error Create Service', 'Error');
          console.error(error);
        });
    }
  }
}
