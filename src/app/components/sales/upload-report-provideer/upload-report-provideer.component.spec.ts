import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadReportProvideerComponent } from './upload-report-provideer.component';

describe('UploadReportProvideerComponent', () => {
  let component: UploadReportProvideerComponent;
  let fixture: ComponentFixture<UploadReportProvideerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadReportProvideerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadReportProvideerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
