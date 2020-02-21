import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit{
  roles: string[];
  public isRolesValid: boolean = true;
  rolesForm: FormGroup;

  constructor(public userService: UserService, private fb: FormBuilder, private router: Router) {

  }

  ngOnInit(): void {
    this.userService.registerFormModel.reset();

    this.userService.getRoles().subscribe((req: string[]) => {
      this.roles = req;
    });

    this.rolesForm = this.fb.group({
      Roles: this.fb.array([], Validators.required)
    })

    //console.log('registration init');
  }

  onSubmit() {
    console.log('registration submitted');
    this.userService.registerFormModel.controls['Roles'].setValue(this.rolesForm.value);

    this.userService.SignUpUser().subscribe(
      (res: any) => {
        console.log('RESPONSE OK');
        this.userService.loginFormModel.get('Email').setValue(this.userService.registerFormModel.get('Email').value);
        this.userService.loginFormModel.get('Password').setValue(this.userService.registerFormModel.get('Passwords.Password').value);

        this.userService.SignInUser().subscribe(
          (res: any) => {
            console.log('result login submit', res.user);
            localStorage.setItem('jwt_token', res.token);

            this.userService.loginFormModel.reset();
            this.userService.registerFormModel.reset();
            this.router.navigateByUrl('/profile');
          },
          err => {
            window.alert(err.error.message);
            console.log('LOGIN RESPONSE ERROR');
          }
        );

      },
      err => {
        window.alert(err.error.message);
        console.log('REGISTR RESPONSE ERROR', err);
      }
    );
  }


  onCheckboxChange(e) {
    const Roles: FormArray = this.rolesForm.get('Roles') as FormArray;

    if (e.target.checked) {
      Roles.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      Roles.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          Roles.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
}
