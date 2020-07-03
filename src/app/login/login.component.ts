import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../shared/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

export const login_validation_messages = {
  username: {
    required: 'Username is required'
  },
  password: {
    required: 'Password is required',
    minlength: 'Password should be of minimum 8 characters',
    pattern: 'Password should have at-least 1 number, 1 lowercase alphabet, 1 uppercase alpabhet and 1 special character from !@#$%^&*()'
  },
  common: {
    authenticationFailed: "Invalid username or password"
  }
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  authFailed: boolean;
  loginSub: Subscription = new Subscription();
  login_validation_messages = login_validation_messages;
  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", 
      [Validators.required, 
      Validators.minLength(8),
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&*\(\)])([0-9a-zA-Z!@#\$%\^&*\(\)]{8,})$/)]] // at-least (1 number, 1 lowercase alphabet, 1 uppercase alphabet, 1 special character !@#$%^&*()), minimum 8 characters length
    });
  }

  login(){
    this.loginSub = this.loginService.login(this.loginForm.get('username').value, this.loginForm.get('password').value).subscribe(result => {
      this.authFailed = false;
      this.router.navigate(['/dashboard']);
    },
    error => {
      this.authFailed = true;
      console.log("Error: error");
    });    
  }

  getErrorMessage(fieldName: string){
    let errorItem = login_validation_messages[fieldName];
    let fieldErrorObject = this.loginForm.get(fieldName).errors;
    let errorString="";

    if(fieldErrorObject){
      for (const errKey in fieldErrorObject) {
        if (fieldErrorObject.hasOwnProperty(errKey)) {
          errorString += errorItem[errKey] + ', ';          
        }
      }
    }
    errorString = errorString.replace(/,(\s*)$/, '');
    return errorString;
  }

  ngOnDestroy(){
    this.loginSub.unsubscribe();
  }

}
