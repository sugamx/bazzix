import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})



export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; // API endpoint for users
  private adminApiUrl = 'http://localhost:3000/admin'; // API endpoint for admin

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn()); // Tracks authentication state
  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser()); // Tracks the current user data

  constructor(private http: HttpClient, private router: Router) {}

  // Observable to expose authentication state
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable(); // Observable for current user data

  // Sign-up method
  signUp(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Login method
  login(email: string, password: string): Observable<{ success: boolean; message?: string }> {
    // Check if the user is admin
    if (email === 'admin@example.com' && password === 'admin123') {
      const admin = { email, role: 'admin' };
      localStorage.setItem('user', JSON.stringify(admin));
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(admin);
      return of({ success: true });
    }

    // Check if the user is a regular user
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map((users) => {
        if (users.length === 0) {
          return { success: false, message: 'Email not found.' };
        }

        const user = users[0];
        if (user.password !== password) {
          return { success: false, message: 'Incorrect password.' };
        }

        // Save the current user's data to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        this.isAuthenticatedSubject.next(true); // Notify subscribers about authentication state
        this.currentUserSubject.next(user); // Notify subscribers about current user data
        return { success: true };
      }),
      catchError(() => {
        return of({ success: false, message: 'An error occurred. Please try again.' });
      })
    );
  }

  
  generateResetToken(email: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      switchMap(users => {
        if (users.length === 0) throw new Error('Email not found');
        
        const user = users[0];
        const resetToken = uuidv4();
        const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry
        
        return this.http.patch<any>(`${this.apiUrl}/${user.id}`, {
          resetToken,
          resetTokenExpiry
        });
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?resetToken=${token}`).pipe(
      switchMap(users => {
        if (users.length === 0) throw new Error('Invalid token');
        
        const user = users[0];
        const now = new Date();
        
        if (new Date(user.resetTokenExpiry) < now) {
          throw new Error('Token expired');
        }

        return this.http.patch<any>(`${this.apiUrl}/${user.id}`, {
          password: newPassword,
          resetToken: null,
          resetTokenExpiry: null
        });
      })
    );
  }
 
  // Logout method
  logout(): void {
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false); // Notify subscribers about authentication state
    this.currentUserSubject.next(null); // Clear current user data
    this.router.navigate(['/login']);
  }

  // Check if user is authenticated
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  // Get the current logged-in user
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  

  // Update the current user's data dynamically
  updateCurrentUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user); // Update the observable with new data
  }

    // Fetch all users
    getAllUsers(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }

  // Submit contact form
  submitContactForm(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}

