import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTypeServiceComponent } from './create-update-type-service.component';

describe('CreateUpdateTypeServiceComponent', () => {
  let component: CreateUpdateTypeServiceComponent;
  let fixture: ComponentFixture<CreateUpdateTypeServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateTypeServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateTypeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
