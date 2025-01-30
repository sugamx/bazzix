import { Component, OnInit } from '@angular/core';
import { CookiePreferences, CookieService } from '../cookie.service';

@Component({
  selector: 'app-cookie-settings',
  standalone: false,
  
  templateUrl: './cookie-settings.component.html',
  styleUrl: './cookie-settings.component.css'
})


export class CookieSettingsComponent implements OnInit {
  preferences: CookiePreferences = { analytics: true, marketing: true };

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    this.preferences = this.cookieService.getPreferences();
  }

  savePreferences() {
    alert('Preferences saved successfully!');
    this.cookieService.savePreferences(this.preferences);
    
    // Optional: Add logic to reload scripts or update cookie settings
  }
}