import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseStatusComponent } from './course-status.component';

describe('CourseStatusComponent', () => {
  let component: CourseStatusComponent;
  let fixture: ComponentFixture<CourseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
