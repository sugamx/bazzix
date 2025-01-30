import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieSettingsComponent } from './cookie-settings.component';

describe('CookieSettingsComponent', () => {
  let component: CookieSettingsComponent;
  let fixture: ComponentFixture<CookieSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookieSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
