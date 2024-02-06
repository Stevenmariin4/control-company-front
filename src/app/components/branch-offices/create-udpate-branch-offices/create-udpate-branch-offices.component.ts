import { NgClass, NgFor, NgIf } from '@angular/common';
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
import { ToastrService } from 'ngx-toastr';
import { BranchOfficesService } from '../../../services/branch-offices/branch-offices.service';
import { IBranchOffices } from '../../../models/branch-offices.interface';
import { IDynamicData } from '../../../models/dynamic.table.interface';

@Component({
  selector: 'app-create-udpate-branch-offices',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './create-udpate-branch-offices.component.html',
  styleUrl: './create-udpate-branch-offices.component.scss',
})
export class CreateUdpateBranchOfficesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toast = inject(ToastrService);
  private routerNavigation = inject(Router);
  private activeRouter = inject(ActivatedRoute);
  private branchOfficesService = inject(BranchOfficesService);

  private idBranchOffices: string | null = null;
  titleButtonSave = 'Crear Sucursal';
  branchOfficesForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    idProvideerPuntored:['', Validators.required]
  });

  ngOnInit(): void {
    this.idBranchOffices = this.activeRouter.snapshot.paramMap.get('id');
    if (this.idBranchOffices) {
      this.titleButtonSave = 'Actualizar';
      this.getBranchOfficesById()
    }
  }

  getBranchOfficesById() {
    if (this.idBranchOffices)
      this.branchOfficesService
        .getById(this.idBranchOffices)
        .then((response: IDynamicData<IBranchOffices>) => {
          const body = response.data;
          this.branchOfficesForm.patchValue({
            name: body.name,
            description: body.description,
            idProvideerPuntored: body.idProvideerPuntored
          });
        })
        .catch((error) => {});
  }

  actionButtonSave() {
    if (this.idBranchOffices) {
      this.update();
    } else {
      this.createBranchOffices();
    }
  }
  private createBranchOffices() {
    const body = this.branchOfficesForm.value;
    body.is_valid = true;
    this.branchOfficesService.create(body).then(
      (response) => {
        this.toast.success('Guardo Exitosamente', 'Operación Realizada');
        this.routerNavigation.navigate(['/admin/branch-offices/list']);
      },
      (error) => {
        this.toast.error('Error Create Service', 'Error');
        console.error(error);
      }
    );
  }

  private update() { 
    const body = this.branchOfficesForm.value;
    body.is_valid = true;
    if (this.idBranchOffices) {
      this.branchOfficesService
        .update(this.idBranchOffices, body)
        .then((response) => {
          this.toast.success('Actualizado Exitosamente', 'Operación Realizada');
          this.routerNavigation.navigate(['/admin/branch-offices/list']);
        })
        .catch((error) => {
          this.toast.error('Error Create Service', 'Error');
          console.error(error);
        });
    }
  }
}
