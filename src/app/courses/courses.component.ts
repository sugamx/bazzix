import { Component } from '@angular/core';
import { Course, CourseService } from '../courses.service';

@Component({
  selector: 'app-courses',
  standalone: false,
  
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  featuredCourses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.fetchFeaturedCourses().subscribe(
      (courses) => (this.featuredCourses = courses),
      (error) => console.error('Error fetching featured courses:', error)
    );
  }
}
