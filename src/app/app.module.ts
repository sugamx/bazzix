import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './shared/material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { FeaturedSectionComponent } from './featured-section/featured-section.component';
import { CoursesComponent } from './courses/courses.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ItemComponent } from './item/item.component';
import { ManageItemsComponent } from './manage-items/manage-items.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { LogoBannerComponent } from './logo-banner/logo-banner.component';
import { FooterSectionComponent } from './footer-section/footer-section.component';
import { AboutUsComponent } from './about-us/about-us.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { CoursesMainComponent } from './courses-main/courses-main.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseListComponent } from './instructor/course-list/course-list.component';
import { CreateCourseComponent } from './instructor/create-course/create-course.component';
import { CourseStatusComponent } from './instructor/course-status/course-status.component';
import { ResourcesSectionComponent } from './instructor/resources-section/resources-section.component';
import { CourseCardComponent } from './instructor/course-card/course-card.component';
import { AdminComponent } from './admin/admin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { CookieSettingsComponent } from './cookie-settings/cookie-settings.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HeroComponent,
    FeaturedSectionComponent,
    CoursesComponent,
    ContactComponent,
    HomeComponent,
    ItemComponent,
    SignUpComponent,
    ManageItemsComponent,
    LoginComponent,
    LogoBannerComponent,
    FooterSectionComponent,
    AboutUsComponent,
    CoursesMainComponent,
    CourseDetailsComponent,
    DashboardComponent,
    CourseListComponent,
    CreateCourseComponent,
    CourseStatusComponent,
    ResourcesSectionComponent,
    CourseCardComponent,
    AdminComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PrivacyPolicyComponent,
    TermsOfServiceComponent,
    CookieSettingsComponent,
    

  

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    NgChartsModule
    
  
    
    
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
