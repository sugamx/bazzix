import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})

export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: AuthService,  // Inject the ContactService
    private emailService: EmailService,  // Inject the ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value; // Get form data

      // Debug: Print formData to check email address
      console.log('Form Data:', formData);

      // Call the submitContactForm method from ContactService
      this.contactService.submitContactForm(formData).subscribe(
        (response) => {
          console.log('Form submitted successfully:', response);

          const emailData = {
            from_name: "Bazzix",
            to_name: formData.name,
            to_email: formData.email,
            message: `Thank you ${formData.name} for contacting us, we will contact you soon!`,
          };

          // Debug: Print emailData to check email address
          console.log('Email Data:', emailData);

          this.emailService
            .sendEmail(emailData)
            .then(() => {
              this.successMessage = `Thank you ${formData.name} for contacting us!`;
              this.errorMessage = null;
              this.contactForm.reset();
            })
            .catch((error) => {
              this.errorMessage = 'There was an issue sending the email. Please try again.';
              this.successMessage = null;
              console.error('Email sending failed:', error);
            });

          alert('Thank you for contacting us!');
          this.contactForm.reset(); // Reset the form after submission
        },
        (error) => {
          console.error('Form submission failed:', error);
          alert('An error occurred. Please try again.');
        }
      );
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  // Helper methods to access form controls for validation messages
  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }
}