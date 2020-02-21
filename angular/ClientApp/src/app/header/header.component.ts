import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  nameOrEmail: string = null;

  ngOnInit(): void {
    if (localStorage.getItem('jwt_token') != null) {
      this.userService.getUserProfile().subscribe(
        (res: any) => {
          this.nameOrEmail = res == null ? null : (res.userName == null ? res.email : res.userName);
        },
        err => {
          console.log(err);
        }
      )
    }
  }
  constructor(public userService: UserService){

  }
}
