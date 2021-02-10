import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-zerodha-login',
  templateUrl: './zerodha-login.component.html',
  styleUrls: ['./zerodha-login.component.css'],
  providers: [],
})
export class ZerodhaLoginComponent implements OnInit {
  apiKey: string = '';

  constructor() {
    this.apiKey = 'm4qs2da7qsbckfz6';
  }

  ngOnInit(): void {
  }

}
