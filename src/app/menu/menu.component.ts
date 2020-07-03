import { Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isLoggedIn: any;
  isLoggedInSub: Subscription = new Subscription();
  userData: any;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.isLoggedInSub = this.loginService.isUserLoggedIn$.subscribe( isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logout(){
    this.loginService.logout();
  }

  ngOnDestroy(){
    this.isLoggedInSub.unsubscribe();
  }

}
