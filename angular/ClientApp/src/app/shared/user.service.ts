import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm, FormBuilder, Validators, FormGroup, FormControlName } from '@angular/forms';
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
    Roles: [[]]
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

  getRoles() {
    return this.http.get(this.url + '/GetRoles');
  }

  getUsers() {
    return this.http.get(this.url);
  }

  // register
  SignUpUser() {
    var body = {
      Email: this.formModel.value.Email,
      UserName: this.formModel.value.UserName,
      FirstName: this.formModel.value.FirstName,
      SecondName: this.formModel.value.SecondName,
      LastName: this.formModel.value.LastName,
      Password: this.formModel.value.Passwords.Password,
      Roles: this.formModel.value.Roles
    }
    console.log(body);
    return this.http.post(this.url + '/registration', body);
  }

  // login
  SignInUser(user: NgForm) {
    return this.http.post(this.url, user);
  }

  updateUser(user: NgForm) {
    return this.http.put(this.url, user);
  }
}
