import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AILearnComponent } from './ailearn.component';

describe('AILearnComponent', () => {
  let component: AILearnComponent;
  let fixture: ComponentFixture<AILearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AILearnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AILearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
