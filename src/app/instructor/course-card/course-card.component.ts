import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../../courses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-card',
  standalone: false,
  
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})



export class CourseCardComponent {
  @Input() course!: Course;
  @Output() statusChange = new EventEmitter<{ courseId: string, status: 'DRAFT' | 'PUBLISHED' }>();
  @Output() delete = new EventEmitter<string>();

  constructor(public router: Router) {}

  editCourse() {
     this.router.navigate(['/instructor/courses/edit', this.course.id]);
    alert('Edit course clicked');
    // this.router.navigate(['/about'])
  }
  

  updateStatus(newStatus: 'DRAFT' | 'PUBLISHED') {
    this.statusChange.emit({
      courseId: this.course.id,
      status: newStatus
    });
  }

  confirmDelete() {
    if (confirm(`Are you sure you want to delete "${this.course.title}"?`)) {
      this.delete.emit(this.course.id);
    }
  }
}