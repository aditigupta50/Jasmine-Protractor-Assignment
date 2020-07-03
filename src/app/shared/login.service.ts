import { Injectable } from '@angular/core';
import { of, throwError, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

const valid_users: { username: string, password: string}[] = [
  {username: "validuser1", password: "TestPassword@123"},
  {username: "validuser2", password: "TestPassword@123"},
  {username: "validuser3", password: "TestPassword@456"},
  {username: "validuser4", password: "TestPassword@456"}
];

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isUserLoggedIn = new BehaviorSubject<any>(null);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();

  constructor(private router: Router) { }

  login(username: string, password: string): Observable<any>{
    let user = valid_users.find(user => user.username===username && user.password===password);
    if(user){
      localStorage.setItem("userLogin", JSON.stringify({
        username: username,
        password: password
      }));
      this.isUserLoggedIn.next(user);
      return of(user);
    }else{
      return throwError(new Error("Invalid user"));
    }    
  }

  logout(){
    localStorage.removeItem("userLogin");
    this.isUserLoggedIn.next(false);
    this.router.navigate(['/home']);
  }

  isLoggedIn(){
    let localStorageUserData = localStorage.getItem("userLogin");
    let isLoggedIn = localStorageUserData? JSON.parse(localStorageUserData): false;
    this.isUserLoggedIn.next(isLoggedIn);
  }

  // isLoggedIn(){
  //   return localStorage.getItem("userLogin")? true: false;
  // }

  getUserData(){
    if(this.isLoggedIn){
      return JSON.parse(localStorage.getItem('userLogin'));
    }else{
      return null;
    }
  }

}
