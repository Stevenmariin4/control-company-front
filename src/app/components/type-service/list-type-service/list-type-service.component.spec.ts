import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeServiceComponent } from './list-type-service.component';

describe('ListTypeServiceComponent', () => {
  let component: ListTypeServiceComponent;
  let fixture: ComponentFixture<ListTypeServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTypeServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListTypeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
