import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateSettingProvideerComponent } from './create-update-setting-provideer.component';

describe('CreateUpdateSettingProvideerComponent', () => {
  let component: CreateUpdateSettingProvideerComponent;
  let fixture: ComponentFixture<CreateUpdateSettingProvideerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateSettingProvideerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateSettingProvideerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
