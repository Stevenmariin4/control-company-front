import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBranchOfficesComponent } from './list-branch-offices.component';

describe('ListBranchOfficesComponent', () => {
  let component: ListBranchOfficesComponent;
  let fixture: ComponentFixture<ListBranchOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBranchOfficesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListBranchOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
