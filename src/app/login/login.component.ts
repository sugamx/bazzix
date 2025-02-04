import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router for navigation
import { AuthService } from '../auth.service'; // Import AuthService
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

import * as UserActions from '../store/actions/user_actions'; 
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string | null = null; // Variable to store error messages

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store // Inject the NgRx store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {}

  showErrorSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  showSuccessSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.success) {
            // Already saved to localStorage in service


            this.errorMessage = null;
            this.showSuccessSnackbar('Login successful');
            const currentUser = this.authService.getCurrentUser();

            if (currentUser && currentUser.id) {
              this.store.dispatch(UserActions.loadUser({ userId: currentUser.id }));
            }
  
            if (currentUser.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.showSuccessSnackbar('Login successful');
              this.router.navigate(['/']);
            }
          } else {
            this.errorMessage = response.message || 'Invalid email or password';
            this.showErrorSnackbar(this.errorMessage);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = 'Connection error';
        }
      });
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }
}