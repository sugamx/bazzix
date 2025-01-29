import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoBannerComponent } from './logo-banner.component';

describe('LogoBannerComponent', () => {
  let component: LogoBannerComponent;
  let fixture: ComponentFixture<LogoBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
