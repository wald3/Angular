import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm, FormBuilder, Validators, FormGroup, FormControlName } from '@angular/forms';
import { User } from './user.model';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class UserService {

  username: string = null;
  private url = "api/user";

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  loginFormModel = this.fb.group({
    Email: ['', Validators.email],
    Password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerFormModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FirstName: [''],
    SecondName: [''],
    LastName: [''],
    Passwords : this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required]
    }, {validator: this.comparePasswords }),
    Roles: []
  });

  //rolesCheck(fb: FormGroup) {
  //  let a = fb.get('Roles');
  
  //  console.log('userService/roles:', a);
  //}

  comparePasswords(fb: FormGroup) {
    let confirmedPassword = fb.get('ConfirmPassword');
    if (confirmedPassword.errors == null || 'passwordMismatch' in confirmedPassword.errors ) {
      if (fb.get('Password').value != confirmedPassword.value)
        confirmedPassword.setErrors({ passwordMismatch: true });
       else
        confirmedPassword.setErrors(null);
    }
  }

  getUsersActionInfo() {
    return this.http.get(this.url + '/GetUsersActionInfo');
  }


  getRoles() {
    console.log('get roles');
    return this.http.get(this.url + '/GetRoles');
  }

  getUser(id) {
    return this.http.get(this.url);
  }

  getUsers() {
    return this.http.get(this.url);
  }

  // register
  SignUpUser() {
    var body = {
      Email: this.registerFormModel.value.Email,
      UserName: this.registerFormModel.value.UserName,
      FirstName: this.registerFormModel.value.FirstName,
      SecondName: this.registerFormModel.value.SecondName,
      LastName: this.registerFormModel.value.LastName,
      Password: this.registerFormModel.value.Passwords.Password,
      Roles: this.registerFormModel.value.Roles['Roles']
    }
    //console.log(body);
    return this.http.post(this.url + '/registration', body);
  }

  // login
  SignInUser() {
    var body = {
      Email: this.loginFormModel.value.Email,
      Password: this.loginFormModel.value.Password
    }
    //console.log('signIn: ', body);
    return this.http.post(this.url + '/login', body);
  }

  updateUser(body) {
    return this.http.put(this.url +'/UpdateProfile', body);
  }

  isMatch(role: string): boolean {
    var userRoles: string[] = JSON.parse(localStorage.getItem('roles'));
    return userRoles.indexOf(role) > -1;
  }

  //get user(): any {
  //  return JSON.parse(localStorage.getItem('user'));
  //}

  getUserProfile() {
    return this.http.get(this.url + '/getUserProfile');
  }
}
