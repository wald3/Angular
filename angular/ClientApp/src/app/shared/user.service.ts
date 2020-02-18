import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
//import { User } from './user.model';
//import { UserSignUp } from './user.singup.model';

@Injectable()
export class UserService {

  private url = "api/users";

  constructor(private http: HttpClient) { }

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
