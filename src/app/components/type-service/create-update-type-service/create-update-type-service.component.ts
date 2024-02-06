import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TypeServiceService } from '../../../services/type-service/type-service.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ITypeService } from '../../../models/typeservice.interface';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../services/loading/loading.service';
import { IDynamicData } from '../../../models/dynamic.table.interface';

@Component({
  selector: 'app-create-update-type-service',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './create-update-type-service.component.html',
  styleUrl: './create-update-type-service.component.scss',
})
export class CreateUpdateTypeServiceComponent implements OnInit {
  typeServiceForm: FormGroup;
  private typeServiceService = inject(TypeServiceService);
  private activeRouter = inject(ActivatedRoute);
  private toast = inject(ToastrService);
  private loadingService = inject(LoadingService);

  private idTypeService: string | null = null;
  public titleButtonSave: string = 'Guardar';


  constructor(private fb: FormBuilder, private routerNavigation: Router) {
    this.typeServiceForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.idTypeService = this.activeRouter.snapshot.paramMap.get('id');
    if (this.idTypeService) {
      this.titleButtonSave = 'Actualizar';
      this.getTypeServiceById(this.idTypeService);
    }
  }

  actionButtonSave() {
    if (this.idTypeService) {
      this.updateTypeService();
    } else {
      this.saveTypeService();
    }
  }

  updateTypeService() {
    if (this.typeServiceForm.valid) {
      const body = this.typeServiceForm.value;
      if (this.idTypeService) {
        this.typeServiceService
          .update(this.idTypeService, body)
          .then(() => {
            this.toast.success(
              'Tipo de servicio Actualizado',
              'Operación Exitosa'
            );
            this.routerNavigation.navigate(['/admin/type-service/list']);
          })
          .catch((error) => {
            this.toast.error('Error Actualizar Tipo De Servicio', 'Error');
          });
      }
    } else {
      // Mark the fields as touched to display error messages
      this.markFieldsAsTouched();
    }
  }
  saveTypeService() {
    if (this.typeServiceForm.valid) {
      const body = this.typeServiceForm.value;
      body.is_valid = true;
      this.typeServiceService
        .create(this.typeServiceForm.value)
        .then((responseService) => {
          this.toast.success('Tipo de servicio Guardado', 'Operación Exitosa');
          this.routerNavigation.navigate(['/admin/type-service/list']);
        })
        .catch((error) => {
          this.toast.error('Error Guardar Tipo De Servicio', 'Error');
        });
    } else {
      // Mark the fields as touched to display error messages
      this.markFieldsAsTouched();
    }
  }

  private markFieldsAsTouched() {
    Object.values(this.typeServiceForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  private getTypeServiceById(id: string) { 
    this.loadingService.showLoader()
    this.typeServiceService
      .getById(id)
      .then((typeService: IDynamicData<ITypeService>) => {
        this.populateForm(typeService?.data);
        this.loadingService.hideLoader();
      })
      .catch((error: any) => {
        this.toast.error('Error update Type Service', 'Error');
        this.loadingService.hideLoader();
      });
  }

  private populateForm(data: ITypeService) {
    this.typeServiceForm.patchValue({
      name: data.name,
      description: data.description,
    });
  }
}
