import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { type } from 'os';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit{
  roles: string[] = [];
  public isRolesValid: boolean = true;
  rolesForm: FormGroup;

  constructor(public userService: UserService, private fb: FormBuilder) {
    this.rolesForm = this.fb.group({
      Roles: this.fb.array([], Validators.required)
    })
    this.userService.getRoles().subscribe((res: string[]) => {
      this.roles = res;
    });
    
  }

  ngOnInit(): void {
    console.log('registration init');
  }

  onSubmit() {
    console.log('registration submitted');
    this.userService.formModel.controls['Roles'].setValue(this.rolesForm.value);
    this.userService.SignUpUser();
    //console.log('Roles:', this.userService.formModel.get('Roles').value);
    //console.log('roles:', this.rolesForm.value);
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
