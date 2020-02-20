import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

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

    this.userService.getRoles().subscribe((req: string[]) => {
      this.roles = req;
    });

    this.rolesForm = this.fb.group({
      Roles: this.fb.array([], Validators.required)
    })
    
  }

  ngOnInit(): void {
    this.userService.registerFormModel.reset();
    console.log('registration init');
  }

    //this.userService.SignUpUser().subscribe(
    //  req => { console.log('RESPONSE', req); }
    //);

  onSubmit() {
    console.log('registration submitted');
    this.userService.registerFormModel.controls['Roles'].setValue(this.rolesForm.value);

    this.userService.SignUpUser().subscribe(
      (res: any) => {
        console.log('RESPONSE OK');
        //window.alert('Succsesful registration');
        this.userService.registerFormModel.reset();
      },
      err => {
        window.alert(err.error.message);
        console.log('RESPONSE ERROR', err);
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
