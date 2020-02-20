import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm, FormBuilder, Validators, FormGroup, FormControlName } from '@angular/forms';
import { User } from './user.model';

@Injectable()
export class UserService {

  authorizedUser: User;
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

  getRoles() {
    console.log('get roles');
    return this.http.get(this.url + '/GetRoles');
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
    console.log('signIn: ', body);
    return this.http.post(this.url + '/login', body);
  }

  updateUser(user: NgForm) {
    return this.http.put(this.url, user);
  }

  isMatch(roles: string[]): boolean {

    return true;
  }
}
