import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit{
  formModel = {
    UserName: '',
    Password: ''
  }
    ngOnInit(): void {
      console.log('login init');
    }

}
