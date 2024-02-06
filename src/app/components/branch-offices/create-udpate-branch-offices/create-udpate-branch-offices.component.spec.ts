import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUdpateBranchOfficesComponent } from './create-udpate-branch-offices.component';

describe('CreateUdpateBranchOfficesComponent', () => {
  let component: CreateUdpateBranchOfficesComponent;
  let fixture: ComponentFixture<CreateUdpateBranchOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUdpateBranchOfficesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUdpateBranchOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
