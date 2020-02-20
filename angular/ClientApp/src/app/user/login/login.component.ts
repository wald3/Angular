import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [UserService],
})
export class LoginComponent implements OnInit{
  formModel = {
    UserName: '',
    Password: ''
  }

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    console.log('login init');
  }

  onSubmit() {
    this.userService.SignInUser();
    console.log('login submitted');
  }

}
