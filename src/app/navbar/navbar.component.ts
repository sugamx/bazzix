import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})


export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false; // Tracks user login state
  dropdownVisible: boolean = false; // Tracks dropdown visibility
  currentUser: any = null;
  currentRoute: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    // Subscribe to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authService.isAuthenticated$.subscribe((authState) => {
      this.isAuthenticated = authState;
    });

    // Subscribe to current user data
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  isAdmin(): boolean {
    const currentUser = this.currentUser;
    return currentUser?.email === 'admin@example.com' || currentUser?.role === 'admin';
  }

  isInstructorRoute(): boolean {
    return this.currentRoute.startsWith('/instructor');
  }

  isAdminRoute(): boolean {
    return this.currentRoute.startsWith('/admin');
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.dropdownVisible = false; // Hide the dropdown
  }
}