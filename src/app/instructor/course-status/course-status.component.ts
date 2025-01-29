import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-status',
  standalone: false,
  
  templateUrl: './course-status.component.html',
  styleUrl: './course-status.component.css'
})


export class CourseStatusComponent {
  @Input() status: 'DRAFT' | 'PUBLISHED' = 'DRAFT'; // Default value
}