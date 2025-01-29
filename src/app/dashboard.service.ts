import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';



export interface User {
  id: string;
  fullName: string;
  email: string;
  chosenCourses: number[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  price: number;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000'; // JSON server base URL

  constructor(private http: HttpClient) {}

  // Fetch user details (e.g., user with id "d158")
  getUserById(userId: string): Observable<User> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users?id=${userId}`)
      .pipe(map((users) => users[0])); // Get the first matching user
  }

  // Fetch all courses
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  // Fetch user-specific chosen courses
  getUserChosenCourses(courseIds: number[]): Observable<Course[]> {
    return this.getCourses().pipe(
      map((courses) => courses.filter((course) => courseIds.includes(course.id)))
    );
  }
}