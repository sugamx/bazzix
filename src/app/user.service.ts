import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${user.id}`, user);
  }

  addCourseToUser(userId: string, courseId: number): Observable<any> {
    return this.getUserById(userId).pipe(
      switchMap((user) => {
        // Ensure chosenCourses is initialized as an array if it doesn't exist
        if (!user.chosenCourses) {
          user.chosenCourses = [];
        }
  
        // Add the course only if it's not already present
        if (!user.chosenCourses.includes(courseId)) {
          user.chosenCourses.push(courseId);
          return this.updateUser(user);
        }
        
        // Return the user as-is if the course is already added
        return of(user);
      })
    );
  }
  
  updateUserCourses(userId: string, updatedCourses: string[]): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${userId}`, { chosenCourses: updatedCourses });
  }
  
}
