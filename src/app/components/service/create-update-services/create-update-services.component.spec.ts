import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateServicesComponent } from './create-update-services.component';

describe('CreateUpdateServicesComponent', () => {
  let component: CreateUpdateServicesComponent;
  let fixture: ComponentFixture<CreateUpdateServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
