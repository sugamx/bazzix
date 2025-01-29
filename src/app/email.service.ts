import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {


  constructor() {
    emailjs.init('hUfuEtNoaI54PIVXC'); // Replace with your EmailJS public key
  }
 
  // sendEmail(formData: any): Promise<void> {
  //   return emailjs.send('contact_service', 'contact_form', formData);
  // }
  sendEmail(formData: any): Promise<void> {
    return emailjs
      .send('service_j5zdmho', 'template_ojrrsnc', formData) // Replace with actual Service ID and Template ID
      .then(() => {
        console.log('Email sent successfully');
      })
      .catch((error) => {
        console.error('Error sending email:', error); // Log errors
        throw error;
      });
  }
}
