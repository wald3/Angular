import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit{
  userDetails;
  roles: string[];
  rolesForm: FormGroup;
  userInfo: string = null;
  isEditActive: boolean = false;
  isAdminView: boolean = false;

  ngOnInit(): void {
    this.userService.getRoles().subscribe((req: string[]) => {
      this.roles = req;
    });

    this.rolesForm = this.fb.group({
      Roles: this.fb.array([])
    })


    if (localStorage.getItem('jwt_token') != null) {
      this.userService.getUserProfile().subscribe(
        (res: any) => {
          this.userDetails = res;
        },
        err => {
          console.log(err);
        }
      )
    }
  }

  constructor(public userService: UserService, private fb: FormBuilder){
  }

  switchView() {
    this.userService.getUsersActionInfo().subscribe((res: any) => {
      this.userInfo = (<string>res.info).replace('|', '\n');
      console.log(this.userInfo);
    })
    this.isAdminView = !this.isAdminView;
  }

  edit() {
    this.isEditActive = true;
  }

  cancel() {
    this.isEditActive = false;
  }

  save() {
    var body = {
      email: this.userDetails.email,
      firstName: this.userDetails.firstName,
      secondName: this.userDetails.secondName,
      lastName: this.userDetails.lastName,
      roles: this.rolesForm.value['Roles']
    }
    console.log(this.rolesForm.value['Roles']);
    this.userDetails.roles = this.rolesForm.value['Roles'];
    this.userService.updateUser(body).subscribe(
      res => {
        console.log('ok', res);
        this.cancel();
      },
      err => {
        console.log('error', err);
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
