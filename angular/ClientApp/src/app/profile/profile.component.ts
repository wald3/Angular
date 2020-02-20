import { Component } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  constructor(public userService: UserService){

  }
}
