import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ResetpasswordService } from '../resetpassword.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})


export class ForgotPasswordComponent  {
  forgotForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private emailService: ResetpasswordService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  get email() {
    return this.forgotForm.get('email');
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.value.email;
      
      this.authService.generateResetToken(email).subscribe({
        next: (user) => {
          const resetLink = `http://localhost:4200/reset-password/${user.resetToken}`;
          
          const emailData = {
            to_name: user.name,
            to_email: user.email,
            reset_link: resetLink
          };

          this.emailService.sendPasswordResetEmail(emailData)
            .then(() => {
              this.successMessage = 'Reset link sent to your email!';
              this.errorMessage = null;
            })
            .catch(error => {
              this.errorMessage = 'Error sending reset link. Please try again.';
              console.error('Email send error:', error);
            });
        },
        error: (err) => {
          this.errorMessage = 'Email not found. Please check your email address.';
          console.error('Error generating reset token:', err);
        }
      });
    }
  }
}