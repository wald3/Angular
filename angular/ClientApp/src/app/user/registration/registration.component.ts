import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  providers: [UserService],
})
export class RegistrationComponent implements OnInit{
  formModel = {
    Email: '',
    UserName : '',
    FirstName : '',
    SecondName : '',
    LastName : '',
    Password : '',
    PasswordConfirmation: ''
  }

  constructor(private service: UserService) {

  }

  ngOnInit(): void {
    console.log('registration init');
  }

  onSubmit() {
    console.log('registration submitted');
  }

}
