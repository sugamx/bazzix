import { Component, OnInit } from '@angular/core';
import { Course, CourseService } from '../../courses.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-list',
  standalone: false,
  
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})

export class CourseListComponent implements OnInit {
  isLoading = true;
  filteredCourses: Course[] = [];
  searchQuery = '';
  currentInstructorId: string;

  constructor(
    public courseService: CourseService,
    private authService: AuthService,
    public router: Router
  ) {
    this.currentInstructorId = this.authService.getCurrentUser().id;
  }

  ngOnInit() {
    this.loadCourses(true);
  }

  loadCourses(force = false) {
    this.isLoading = true;
    this.courseService.loadCourses(force).subscribe({
      next: () => {
        this.isLoading = false;
        this.filterCourses();
      },
      error: () => this.isLoading = false
    });
  }

  private filterCourses() {
    const currentUser = this.authService.getCurrentUser();
    this.filteredCourses = this.courseService.coursesSubject.value
      .filter(course => 
        course.instructor_id === currentUser?.id &&
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
  }

  confirmDelete(courseId: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.filterCourses();
          this.router.navigate(['/instructor/courses']);
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.filterCourses();
  }
}