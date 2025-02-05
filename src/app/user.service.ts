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

  // user.service.ts
  addCourseToUser(userId: string, courseId: string): Observable<any> {
    return this.getUserById(userId).pipe(
      switchMap((user) => {
        if (!user.chosenCourses) {
          user.chosenCourses = [];
        }
        // Convert courseId to string to ensure consistency
        const courseIdStr = courseId.toString();
        if (!user.chosenCourses.includes(courseIdStr)) {
          user.chosenCourses.push(courseIdStr);
          return this.updateUser(user);
        }
        return of(user);
      })
    );
  }

  updateUserCourses(userId: string, updatedCourses: string[]): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${userId}`, { chosenCourses: updatedCourses });
  }

}
