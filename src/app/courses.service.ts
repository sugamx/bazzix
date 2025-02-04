import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  image: string;
  status?: 'DRAFT' | 'PUBLISHED'; // Add status field
  rating?: number;
  total_reviews?: number;
  total_enrolled?: number;
  duration_hours?: number;
  level?: string;
  category?: string;
  language?: string;
  subtitles?: string[];
  lectures?: number;
  resources?: string[];
  prerequisites?: string[];
  objectives?: string[];
  what_you_get?: string[];
  last_updated?: string;
  promotion_badge?: string;
  discount?: number;
  original_price?: number;

  created_at?: string;
  updated_at?: string;

  instructor_id: string;  // Reference to instructor ID
  instructor_name?: string;
  instructor_rating?: number;
  instructor_students?: number;
  instructor_courses?: number;
  
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private apiUrl = 'http://localhost:3000/courses';
  public coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private setDefaultCourseValues(course: Course): Course {
    return {
      ...course,
      instructor_id: course.instructor_id || '',
      instructor_name: course.instructor_name || 'Unknown Instructor',
      image: course.image || './assets/default-course.jpg',
      rating: course.rating || 0,
      total_reviews: course.total_reviews || 0,
      total_enrolled: course.total_enrolled || 0,
      lectures: course.lectures || 0,
      prerequisites: course.prerequisites || [],
      objectives: course.objectives || [],
      last_updated: course.last_updated || new Date().toISOString(),
      status: course.status || 'DRAFT',
      created_at: course.created_at || new Date().toISOString(),
      updated_at: course.updated_at || new Date().toISOString()
    };
  }

  loadCourses(forceReload: boolean = false): Observable<Course[]> {
    if (forceReload || this.coursesSubject.value.length === 0) {
      return this.http.get<Course[]>(this.apiUrl).pipe(
        map(courses => courses.map(this.setDefaultCourseValues)),
        tap(courses => this.coursesSubject.next(courses)),
        catchError(error => {
          console.error('Error loading courses:', error);
          return throwError(() => new Error('Failed to load courses'));
        })
      );
    }
    return this.courses$;
  }

  
  createCourse(courseData: any): Observable<Course> {
    const currentUser = this.authService.getCurrentUser();
    
    // Add instructor_id from logged-in user
    const courseWithInstructor = {
      ...courseData,
      instructor_id: currentUser.id,
      instructor_name: currentUser.name  // Add instructor name
    };
  
    return this.http.post<Course>(this.apiUrl, courseWithInstructor).pipe(
      tap((createdCourse) => {
        const currentCourses = this.coursesSubject.value;
        this.coursesSubject.next([
          ...currentCourses, 
          this.setDefaultCourseValues(createdCourse)
        ]);
      }),
      catchError((error) => {
        console.error('Error creating course:', error);
        return throwError(() => new Error('Failed to create course'));
      })
    );
  }

  updateCourse(courseId: string, updates: any): Observable<Course> {
    // Ensure we're working with fresh data
    return this.http.patch<Course>(`${this.apiUrl}/${courseId}`, updates).pipe(
      tap((updatedCourse) => {
        const currentCourses = this.coursesSubject.value;
        const updatedCourses = currentCourses.map(course => 
          course.id === courseId ? this.setDefaultCourseValues({
            ...course,
            ...updatedCourse,
            updated_at: new Date().toISOString()  // Force update timestamp
          }) : course
        );
        this.coursesSubject.next(updatedCourses);
      }),
      catchError((error) => {
        console.error('Error updating course:', error);
        return throwError(() => new Error('Failed to update course'));
      })
    );
  }
  
    deleteCourse(courseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}`).pipe(
      tap(() => {
        const currentCourses = this.coursesSubject.value;
        const filteredCourses = currentCourses.filter(course => course.id !== courseId);
        this.coursesSubject.next(filteredCourses);
      }),
      catchError(error => {
        console.error('Error deleting course:', error);
        return throwError(() => new Error('Failed to delete course'));
      })
    );
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      map(this.setDefaultCourseValues),
      catchError(error => {
        console.error('Error fetching course:', error);
        return throwError(() => new Error('Course not found'));
      })
    );
  }

  fetchFeaturedCourses(): Observable<Course[]> {
    return this.loadCourses().pipe(
      map(courses => courses
        .slice(0, 4)
      )
    );
  }
}