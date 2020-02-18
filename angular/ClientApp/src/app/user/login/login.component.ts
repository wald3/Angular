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

  constructor(private service: UserService) {

  }

  ngOnInit(): void {
    console.log('login init');
  }

  onSubmit() {
    console.log('login submitted');
  }

}
