import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service'; // Import the AuthService
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: false,
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService // Inject the AuthService
  ) {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, [Validators.requiredTrue]]
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
    if (this.signUpForm.valid) {
      const user = this.signUpForm.value; // Get form data

      // Call the signUp method from AuthService
      this.authService.signUp(user).subscribe(
        (response) => {
          console.log('Sign-up successful:', response);
          this.showSuccessSnackbar('Sign-up successful!'); // Show success message
          this.router.navigate(['/login']);
          // alert('Sign-up successful!'); // Show success message
          this.signUpForm.reset(); // Reset the form
        },
        (error) => {
         
          this.showErrorSnackbar('Sign-up failed:'); // Show error message in a snackbar
          console.error('Sign-up failed:', error);
          alert('Sign-up failed. Please try again.'); // Show error message
        }
      );
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  get fullName() {
    return this.signUpForm.get('fullName');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get terms() {
    return this.signUpForm.get('terms');
  }
}