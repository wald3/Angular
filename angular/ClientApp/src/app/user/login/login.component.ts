import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';

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

  constructor(private userService: UserService, private router: Router) {

  }

  ngOnInit(): void {
    if (localStorage.getItem('jwt_token') != null) {
      this.router.navigateByUrl('/');
    }
    //console.log('login init');
  }

  onSubmit() {
    this.userService.SignInUser().subscribe(
      (res: any) => {
        console.log('result login submit', res.user);
        localStorage.setItem('jwt_token', res.token);
        //localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('roles',JSON.stringify(res.roles));
        this.router.navigateByUrl('/profile');
      },
      err => {
        window.alert(err.error.message);
        console.log('LOGIN RESPONSE ERROR');
      }
    );
    //console.log('login submitted');
  }

}
