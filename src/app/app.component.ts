import { Component, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { loadUser } from './store/actions/user_actions';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})


export class AppComponent implements OnInit {

  protected title = 'app';

  constructor(
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit() {
    
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user?.id) {
        console.log('Loading user data for:', user);
        this.store.dispatch(loadUser({ userId: user.id }));
      }
      else {
 console.log('ERROR loading');;
      }
     
    }
  }

}