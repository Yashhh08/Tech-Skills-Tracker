import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from './../users.service';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit {
  users: string[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.users = this.userService.activeUsers;
  }

  onSetToInactive(id) {
    this.userService.onSetToInactive(id);
  }

}