import { Component, OnInit } from '@angular/core';
import { Course, CourseService } from '../courses.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-course-details',
  standalone: false,
  
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})

// course-details.component.ts
export class CourseDetailsComponent implements OnInit {
  course!: Course;
  enrolled = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (data) => {
          this.course = data;
          this.checkEnrollment();
        },
        error: (error) => console.error('Error fetching course:', error)
      });
    }
  }

  checkEnrollment() {
    const user = this.authService.getCurrentUser();
  
    // Safely check for chosenCourses and course enrollment
    if (user && Array.isArray(user.chosenCourses) && user.chosenCourses.includes(this.course.id)) {
      this.enrolled = true;
    } else {
      this.enrolled = false;
    }
  }
  enrollCourse() {
    const user = this.authService.getCurrentUser();
    console.log('Enrolling User:', user); // Debugging step
    console.log('Course ID:', this.course.id);
  
    if (!user || !user.id) {
      console.error('User ID is missing or user is not logged in.');
      this.message = 'Please log in to enroll.';
      return;
    }
  
    this.userService.addCourseToUser(user.id, this.course.id).subscribe({
      next: (updatedUser) => {
        this.enrolled = true;
        this.message = 'Successfully enrolled in this course!';
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage with new data
        this.authService.updateCurrentUser(updatedUser); // Notify components of the change
      },
      error: (error) => {
        console.error('Enrollment failed:', error);
        this.message = 'Enrollment failed. Please try again.';
      }
    });
  }
  
  

  unenrollCourse() {
    const user = this.authService.getCurrentUser();
    
    if (!user || !user.id) {
      console.error('User ID is missing or user is not logged in.');
      this.message = 'Please log in to unenroll.';
      return;
    }
  
    // Remove the course ID from the user's chosenCourses
    const updatedCourses = user.chosenCourses.filter((courseId: string) => courseId !== this.course.id.toString());

  
    // Update the user on the backend
    this.userService.updateUserCourses(user.id, updatedCourses).subscribe({
      next: (updatedUser) => {
        this.enrolled = false;
        this.message = 'Successfully removed the course!';
        // Update localStorage with the new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
      },
      error: (error) => {
        console.error('Failed to unenroll from the course:', error);
        this.message = 'Failed to remove the course. Please try again.';
      }
    });
  }
  
}