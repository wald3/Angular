import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm, FormBuilder } from '@angular/forms';
//import { User } from './user.model';
//import { UserSignUp } from './user.singup.model';

@Injectable()
export class UserService {

  private url = "api/user";

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  formModel = this.fb.group({
    UserName: [''],
    Email: [''],
    FirstName: [''],
    SecondName: [''],
    LastName: [''],
    Passwords : this.fb.group({
      Password: [''],
      ConfirmPassword: ['']
    }),
    Roles: []
  });


  getRoles() {
    return this.http.get(this.url + '/GetRoles');
  }

  getUsers() {
    return this.http.get(this.url);
  }

  SignUpUser(user: NgForm) {
    return this.http.post(this.url, user);
  }

  SignInUser(user: NgForm) {
    return this.http.post(this.url, user);
  }

  updateUser(user: NgForm) {
    return this.http.put(this.url, user);
  }
}
