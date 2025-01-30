import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { CoursesComponent } from './courses/courses.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { CoursesMainComponent } from './courses-main/courses-main.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { CourseListComponent } from './instructor/course-list/course-list.component';
import { CreateCourseComponent } from './instructor/create-course/create-course.component';
import { AdminComponent } from './admin/admin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CookieSettingsComponent } from './cookie-settings/cookie-settings.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
// import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route (HomeComponent)
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path:'contact',component:ContactComponent},
  {path:'about',component: AboutUsComponent},
  {path:'courses',component:CoursesComponent},
  { path: 'course/:id', component: CourseDetailsComponent }, 
  {path:'coursesMain',component:CoursesMainComponent},
  { path:'dashboard',component:DashboardComponent,canActivate: [AuthGuard]},
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'cookie-settings', component: CookieSettingsComponent },
  {
    path: 'instructor',
    canActivate: [AuthGuard], // Protect instructor routes with AuthGuard
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      { path: 'courses', component: CourseListComponent }, 
      { path: 'courses/edit/:id', component: CreateCourseComponent }, 
      { path: 'create', component: CreateCourseComponent }
    ]
  },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }, // Add admin route
  { path: '**', redirectTo: '', pathMatch: 'full' }

  

];
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled'
};

@NgModule({
  imports: [RouterModule.forRoot(routes,routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
