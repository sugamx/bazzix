import { Injectable } from '@angular/core';

export interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }
  private readonly COOKIE_KEY = 'cookiePreferences';

  getPreferences(): CookiePreferences {
    const saved = localStorage.getItem(this.COOKIE_KEY);
    return saved ? JSON.parse(saved) : { analytics: true, marketing: true };
  }

  savePreferences(prefs: CookiePreferences): void {
    localStorage.setItem(this.COOKIE_KEY, JSON.stringify(prefs));
    // Here you would typically set/remove actual cookies
    console.log('Cookie preferences updated:', prefs);
  }

    // Add this new method
    clearPreferences(): void {
      localStorage.removeItem(this.COOKIE_KEY);
      console.log('Cookie preferences cleared');
    }
}
