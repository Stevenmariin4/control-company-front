import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProvideerComponent } from './details-provideer.component';

describe('DetailsProvideerComponent', () => {
  let component: DetailsProvideerComponent;
  let fixture: ComponentFixture<DetailsProvideerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsProvideerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsProvideerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
