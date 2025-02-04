import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserName } from '../store/selectors/user.selectors';

@Component({
  selector: 'app-navbar',
  standalone: false,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})


export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  dropdownVisible: boolean = false;
  currentUser: any = null;
  currentRoute: string = '';
  mobileMenuActive: boolean = false;
  userName$: Observable<string>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef,
    private store: Store
  ) {
    this.userName$ = this.store.select(selectUserName);
    this.setupRouteListener();
  }

  private setupRouteListener(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this.closeMobileMenu();
      }
    });
  }

  ngOnInit(): void {
    this.setupAuthSubscriptions();
  }

  private setupAuthSubscriptions(): void {
    this.authService.isAuthenticated$.subscribe(authState => {
      this.isAuthenticated = authState;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.email === 'admin@example.com' || 
           this.currentUser?.role === 'admin';
  }

  toggleMobileMenu(): void {
    this.mobileMenuActive = !this.mobileMenuActive;
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.mobileMenuActive ? 'hidden' : 'auto';
    
    // Close dropdown if open
    if (this.mobileMenuActive) {
      this.dropdownVisible = false;
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuActive = false;
    document.body.style.overflow = 'auto';
  }

  // Call this method when a nav link is clicked
  onNavLinkClick(): void {
    this.closeMobileMenu();
  }

  isInstructorRoute(): boolean {
    return this.currentRoute.startsWith('/instructor');
  }

  isAdminRoute(): boolean {
    return this.currentRoute.startsWith('/admin');
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    // Check if click is outside both the dropdown and user icon
    if (!this.elementRef.nativeElement.contains(target)) {
      this.dropdownVisible = false;
    }

    // Close mobile menu when clicking outside
    if (!target.closest('.menu-toggle') && 
        !target.closest('.nav-links') && 
        this.mobileMenuActive) {
      this.closeMobileMenu();
    }
  }

  // Add escape key handler to close menus
  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    this.dropdownVisible = false;
    this.closeMobileMenu();
  }

  logout(): void {
    this.authService.logout();
    this.dropdownVisible = false;
    this.closeMobileMenu();
  }
}