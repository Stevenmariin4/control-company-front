import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateReportDailyComponent } from './create-update-report-daily.component';

describe('CreateUpdateReportDailyComponent', () => {
  let component: CreateUpdateReportDailyComponent;
  let fixture: ComponentFixture<CreateUpdateReportDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateReportDailyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateReportDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
