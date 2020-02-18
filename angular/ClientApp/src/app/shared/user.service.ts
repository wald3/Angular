import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
//import { User } from './user.model';
//import { UserSignUp } from './user.singup.model';

@Injectable()
export class UserService {

  private url = "api/user";

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FirstName: [''],
    SecondName: [''],
    LastName: [''],
    Passwords : this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required]
    }, {validator: this.comparePasswords }),
    Roles: [[], { validator: this.roleChecks }]
  });

  roleChecks(fb: FormGroup) {
    //let 
  }

  comparePasswords(fb: FormGroup) {
    let confirmedPassword = fb.get('ConfirmPassword');
    if (confirmedPassword.errors == null || 'passwordMismatch' in confirmedPassword.errors ) {
      if (fb.get('Password').value != confirmedPassword.value)
        confirmedPassword.setErrors({ passwordMismatch: true });
       else
        confirmedPassword.setErrors(null);
    }

  }

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
