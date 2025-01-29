import { Component, OnInit } from '@angular/core';
import { Course, DashboardService, User } from '../dashboard.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CourseService } from '../courses.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // Fixed typo in `styleUrls`

})

export class DashboardComponent implements OnInit {
  user: any;
  enrolledCourses: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.userService.getUserById(this.user.id).subscribe({
        next: (userData) => {
          this.user = userData;
          this.loadEnrolledCourses(userData.chosenCourses);
        },
        error: (error) => console.error('Error fetching user data:', error)
      });
    }
  }

  loadEnrolledCourses(courseIds: number[]) {
    this.enrolledCourses = [];
    courseIds.forEach(id => {
      this.courseService.getCourseById(id.toString()).subscribe({
        next: (course) => this.enrolledCourses.push(course),
        error: (error) => console.error('Error fetching course:', error)
      });
    });
  }
}