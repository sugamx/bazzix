import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {
  constructor() {
    emailjs.init('hUfuEtNoaI54PIVXC');
  }

  sendPasswordResetEmail(formData: any): Promise<void> {
    return emailjs
      .send('service_j5zdmho', 'template_ojrrsnc', formData)
      .then(() => console.log('Reset email sent'))
      .catch(error => {
        console.error('Error sending reset email:', error);
        throw error;
      });
  }
}
