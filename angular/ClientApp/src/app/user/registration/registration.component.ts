import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit{
  roles: string[] = [];
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
    console.log(this.rolesForm.value);
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
