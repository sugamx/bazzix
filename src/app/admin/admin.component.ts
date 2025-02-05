import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../courses.service';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-admin',
  standalone: false,

  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})


export class AdminComponent implements OnInit {
  users: any[] = [];
  contactSubmissions: any[] = [];
  showStats: boolean = false;
  courseStats: any[] = [];

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private courseService: CourseService,

  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadContactSubmissions();
    this.loadAllData();
  }

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false  // This will hide the legend (pink slab with text)
      }
    }
  };
  barChartLabels: string[] = [];
  barChartData: ChartData['datasets'] = [];

  // Pie Chart Configuration
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };
  pieChartLabels: string[] = [];
  pieChartData: ChartData['datasets'] = [];




  showStatistics() {
    this.showStats = !this.showStats;
    if (this.showStats) {
      this.loadAllData();
    }
  }

  loadAllData() {
    // Get all courses and users
    this.courseService.loadCourses().subscribe(courses => {
      this.authService.getAllUsers().subscribe(users => {
        // Calculate enrollment statistics
        const enrollmentStats = this.calculateEnrollmentStats(courses, users);
        this.courseStats = enrollmentStats;

        // Update chart data
        this.updateChartData(enrollmentStats);
      });
    });
  }

  calculateEnrollmentStats(courses: any[], users: any[]) {
    const stats = courses.map(course => {
      const enrollments = users.filter(user =>
        user.chosenCourses && user.chosenCourses.some((c: string) =>
          String(c) === String(course.id) // Compare as strings
        )
      ).length;

      return {
        id: course.id,
        title: course.title,
        enrollments: enrollments,
        instructor: course.instructor,
        percentage: 0 // Will calculate after getting total
      };
    });

    // Calculate percentages
    const totalEnrollments = stats.reduce((sum, course) => sum + course.enrollments, 0);
    stats.forEach(course => {
      course.percentage = totalEnrollments > 0
        ? parseFloat(((course.enrollments / totalEnrollments) * 100).toFixed(1))
        : 0;
    });

    return stats;
  }

  // Compute a 32-bit unsigned integer hash using a djb2 variant.
  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    // Ensure non-negative 32-bit integer.
    return hash >>> 0;
  }

  // Mulberry32 PRNG: returns a function that produces a pseudo-random number between 0 and 1.
  private mulberry32(seed: number): () => number {
    return function () {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
  }

  // Generate a course color using a seedable PRNG.
  // This ensures that even similar ids produce a varied color by deriving hue, saturation, and lightness independently.
  private getCourseColor(id: string): string {
    const seed = this.hashString(id);
    const rand = this.mulberry32(seed);

    // Hue between 0 and 359
    const hue = Math.floor(rand() * 360);
    // Saturation between 60% and 100%
    const saturation = Math.floor(rand() * 41) + 60;
    // Lightness between 40% and 70%
    const lightness = Math.floor(rand() * 31) + 40;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }


  updateChartData(stats: any[]) {
    // Update Bar Chart
    this.barChartLabels = stats.map(stat => stat.title);
    this.barChartData = [{
      data: stats.map(stat => stat.enrollments),
      label: 'Enrollments',
      backgroundColor: stats.map(stat => this.getCourseColor(stat.id)) // Dynamic color per course
    }];

    // Update Pie Chart
    this.pieChartLabels = stats.map(stat => stat.title);
    this.pieChartData = [{
      data: stats.map(stat => stat.enrollments),
      backgroundColor: stats.map(stat => this.getCourseColor(stat.id)) // Dynamic color per course
    }];
  }



  loadUsers(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadContactSubmissions(): void {
    this.authService.getContactSubmissions().subscribe(submissions => {
      this.contactSubmissions = submissions.map(submission => ({
        ...submission,
        expanded: false
      }));
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.authService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          this.showSnackbar('User deleted successfully', 'success');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.showSnackbar('Error deleting user', 'error');
        }
      });
    }
  }

  deleteContact(id: string): void {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      this.authService.deleteContactSubmission(id).subscribe({
        next: () => {
          this.contactSubmissions = this.contactSubmissions.filter(
            contact => contact.id !== id
          );
          this.showSnackbar('Contact submission deleted successfully', 'success');
        },
        error: (error) => {
          console.error('Error deleting contact submission:', error);
          this.showSnackbar('Error deleting contact submission', 'error');
        }
      });
    }
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}