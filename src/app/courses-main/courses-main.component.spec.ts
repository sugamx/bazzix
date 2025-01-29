import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesMainComponent } from './courses-main.component';

describe('CoursesMainComponent', () => {
  let component: CoursesMainComponent;
  let fixture: ComponentFixture<CoursesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursesMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
