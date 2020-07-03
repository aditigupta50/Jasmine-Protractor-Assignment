import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {Location} from "@angular/common";
import { LoginComponent, login_validation_messages } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes, Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginService } from '../shared/login.service';
import { of, throwError } from 'rxjs';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }
];

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let validUserName = "validusername";
  let validPassword = "TestPassword@123";
  let router: Router;
  let location: Location;
  let loginService: LoginService;
  let loginServiceSpy: any;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent, DashboardComponent ],
      imports: [RouterTestingModule.withRoutes(routes), ReactiveFormsModule],
      providers: [FormBuilder, LoginService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    loginService = TestBed.get(LoginService);
    router.initialNavigation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Check form and fields when login page loads', ()=>{

    it('Form model should be defined', ()=>{
      expect(component.loginForm).toBeDefined();
    });

    it('Form should be rendered with username and password fields and a submit button', ()=>{
      expect(de.nativeElement.querySelector('#username')).toBeDefined();
      expect(de.nativeElement.querySelector('#password')).toBeDefined();
      expect(de.nativeElement.querySelector('#login-btn')).toBeDefined();
    });

    it('username and password form fields should be invalid', ()=>{
      let usernameField = component.loginForm.get('username');
      let passwordField = component.loginForm.get('password');

      expect(usernameField.valid).toBeFalsy();
      expect(passwordField.valid).toBeFalsy();

      expect(usernameField.errors.required).toBeTruthy();
      expect(passwordField.errors.required).toBeTruthy();
    });

    it('Initially on page load, field error messages are not displayed', ()=>{
      expect(de.nativeElement.querySelector('#username-err').hidden).toBeTruthy();
      expect(de.nativeElement.querySelector('#password-err').hidden).toBeTruthy();
    });

    it('Form should be invalid', ()=>{
      expect(component.loginForm.valid).toBeFalsy();
    });
    
    it('Login button should be disabled', ()=>{
      //let loginBtnEl = de.query(By.css('#login-btn'));
      //expect(loginBtnEl).toBeTruthy();
      expect(de.nativeElement.querySelector('#login-btn').disabled).toBeTruthy();
    });
  });

  describe('Check display of form fields error messages as user fills the form', ()=>{
    it('Required error message displayed when user clicks on a form field and clicks outside of it without filling the field', ()=>{
      const usernameInput = de.query(By.css('#username'));      
      const passwordInput = de.query(By.css('#password'));
      usernameInput.triggerEventHandler('click', null);
      usernameInput.nativeElement.dispatchEvent(new Event('blur'));
      passwordInput.triggerEventHandler('click', null);
      passwordInput.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(de.nativeElement.querySelector('#username-err').hidden).toBeFalsy();
      expect(de.nativeElement.querySelector('#username-err').textContent.includes(login_validation_messages.username.required)).toBeTruthy();
      expect(de.nativeElement.querySelector('#password-err').hidden).toBeFalsy();
      expect(de.nativeElement.querySelector('#password-err').textContent.includes(login_validation_messages.password.required)).toBeTruthy();
    });

    it('When a required error message appears for username field, the message goes away on typing a username', ()=>{
      const usernameInput = de.query(By.css('#username'));
      usernameInput.triggerEventHandler('click', null);
      usernameInput.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(de.nativeElement.querySelector('#username-err').hidden).toBeFalsy();
      expect(de.nativeElement.querySelector('#username-err').textContent.includes(login_validation_messages.username.required)).toBeTruthy();
      
      component.loginForm.get('username').setValue(validUserName);
      fixture.detectChanges();

      expect(de.nativeElement.querySelector('#username-err').hidden).toBeTruthy();
      expect(de.nativeElement.querySelector('#username-err').textContent.includes(login_validation_messages.username.required)).toBeFalsy();
    });

    it('When a required error message appears for password field, the message goes away on typing a password', ()=>{
      const passwordInput = de.query(By.css('#password'));
      passwordInput.triggerEventHandler('click', null);
      passwordInput.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(de.nativeElement.querySelector('#password-err').hidden).toBeFalsy();
      expect(de.nativeElement.querySelector('#password-err').textContent.includes(login_validation_messages.password.required)).toBeTruthy();
      
      component.loginForm.get('password').setValue("testpwd");
      fixture.detectChanges();
      
      expect(de.nativeElement.querySelector('#password-err').textContent.includes(login_validation_messages.password.required)).toBeFalsy();
    });

    it('No error message is displayed when a valid username is entered', ()=>{
      component.loginForm.get('username').setValue(validUserName);
      fixture.detectChanges();

      expect(de.nativeElement.querySelector('#username-err').hidden).toBeTruthy();
      expect(de.nativeElement.querySelector('#username-err').textContent.trim()).toBeFalsy();
    });

    it('No error message is displayed when a valid password is entered', ()=>{
      component.loginForm.get('password').setValue(validPassword);
      fixture.detectChanges();

      expect(de.nativeElement.querySelector('#password-err').hidden).toBeTruthy();
      expect(de.nativeElement.querySelector('#password-err').textContent.trim()).toBeFalsy();
    });

    it('Show error message when a password less than 8 characters is entered and field loses focus', ()=>{
      component.loginForm.get('password').setValue("test");
      de.query(By.css('#password')).nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(de.nativeElement.querySelector('#password-err').hidden).toBeFalsy();
      expect(de.nativeElement.querySelector('#password-err').textContent.includes(login_validation_messages.password.minlength)).toBeTruthy();
    });

    it('Show error message when an invalid password is entered and field loses focus', ()=>{
      component.loginForm.get('password').setValue("testPassword123");
      de.query(By.css('#password')).nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      expect(de.nativeElement.querySelector('#password-err').hidden).toBeFalsy();
      expect(de.nativeElement.querySelector('#password-err').textContent.includes(login_validation_messages.password.pattern)).toBeTruthy();
    });

    it('When an error message appears for an invalid password, the message goes away on typing a valid password', ()=>{
      component.loginForm.get('password').setValue("testPassword123");
      de.query(By.css('#password')).nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      expect(de.nativeElement.querySelector('#password-err').hidden).toBeFalsy();
      expect(de.nativeElement.querySelector('#password-err').textContent.includes(login_validation_messages.password.pattern)).toBeTruthy();

      component.loginForm.get('password').setValue(validPassword);
      de.query(By.css('#password')).nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      
      expect(de.nativeElement.querySelector('#password-err').hidden).toBeTruthy();
      expect(de.nativeElement.querySelector('#password-err').textContent.includes(login_validation_messages.password.pattern)).toBeFalsy();
    });

    it('No error messages are displayed when all required fields are filled with valid values', ()=>{
      component.loginForm.get('username').setValue(validUserName);
      component.loginForm.get('password').setValue(validPassword);
      fixture.detectChanges();
      expect(de.nativeElement.querySelector('#username-err').hidden).toBeTruthy();
      expect(de.nativeElement.querySelector('#password-err').hidden).toBeTruthy();
    });

    it('Form is valid when all required fields are filled with valid values', ()=>{
      component.loginForm.get('username').setValue(validUserName);
      component.loginForm.get('password').setValue(validPassword);
      fixture.detectChanges();
      expect(component.loginForm.valid).toBeTruthy();
    });

    it('Login button is enabled when all required fields are filled with valid values', ()=>{
      component.loginForm.get('username').setValue(validUserName);
      component.loginForm.get('password').setValue(validPassword);
      fixture.detectChanges();
      expect(de.nativeElement.querySelector('#login-btn').disabled).toBeFalsy();
    });

  });

  describe('Check authentication using Login functionality', () => {
    describe('When valid credentials are entered and login button is clicked', () => {
      let validUserName = "validuser1";
      let validPassword = "TestPassword@123";

      beforeEach(() => {  
        spyOn(component, 'login').and.callThrough();
        loginServiceSpy = spyOn(loginService, 'login').and.returnValue(of({username: validUserName, password: validPassword}));      
       
        component.loginForm.get('username').setValue(validUserName);
        component.loginForm.get('password').setValue(validPassword);
        fixture.detectChanges();
      })

      // afterEach(() => {
      //   localStorage.clear();
      // })

      it('Component login method is called', () => {
        de.nativeElement.querySelector('#login-btn').click();  
        expect(component.login).toHaveBeenCalled();
      });

      it('Service login method is called with entered username and password', () => {
        de.nativeElement.querySelector('#login-btn').click();

        expect(loginService.login).toHaveBeenCalledWith(validUserName, validPassword);
      });

      // fit('Local storage is set with the user data', () =>{
      //   de.nativeElement.querySelector('#login-btn').click();

      //   let userLoginLocalStorageItem = JSON.parse(localStorage.getItem("userLogin"));
      //   expect(userLoginLocalStorageItem.username).toBe(validUserName);
      //   expect(userLoginLocalStorageItem.password).toBe(validPassword);
      // });

      it('User is re-directed to dashboard page', fakeAsync(() => {
        de.nativeElement.querySelector('#login-btn').click();
        tick();
        //console.log("router1", router.url);
        expect(location.path()).toBe('/dashboard');
      }));
    });

    describe('When invalid credentials are entered and login button is clicked', () => {
      let invalidUserName = "validuser7";
      let invalidPassword = "TestPassword@123456";

      beforeEach(() => {  
        spyOn(component, 'login').and.callThrough();
        loginServiceSpy = spyOn(loginService, 'login').and.returnValue(throwError(new Error("Invalid user")));      
       
        component.loginForm.get('username').setValue(invalidUserName);
        component.loginForm.get('password').setValue(invalidPassword);
        fixture.detectChanges();
      })

      it('Component login method is called', () => {
        de.nativeElement.querySelector('#login-btn').click();  
        expect(component.login).toHaveBeenCalled();
      });

      it('Service login method is called with entered username and password', () => {
        de.nativeElement.querySelector('#login-btn').click();
        expect(loginService.login).toHaveBeenCalledWith(invalidUserName, invalidPassword);
      });

      // it('Local storage is not set with the user data', () => {
      //   de.nativeElement.querySelector('#login-btn').click();

      //   let userLoginLocalStorageItem = JSON.parse(localStorage.getItem("userLogin"));
      //   expect(userLoginLocalStorageItem).toBeUndefined();
      // });

      it('User is not re-directed to dashboard page', fakeAsync(() => {
        de.nativeElement.querySelector('#login-btn').click();
        tick();
        //console.log("router2", router.url)
        expect(location.path()).not.toBe('/dashboard');
      }));

      it('Invalid username or password error message is displayed', fakeAsync(() => {
        de.nativeElement.querySelector('#login-btn').click();
        tick();
        fixture.detectChanges();
        //console.log("router2", router.url)
        expect(component.authFailed).toBeTruthy();
        expect(de.nativeElement.querySelector('#invalid-cred-err')).toBeDefined();        
        expect(de.nativeElement.querySelector('#invalid-cred-err').textContent.includes(login_validation_messages.common.authenticationFailed)).toBeTruthy();
      }));
    });

    // fit('User is re-directed to dashboard page when valid credentials are entered and login button is clicked', fakeAsync(() => {
    //   let validUserName = "validuser1";
    //   let validPassword = "TestPassword@123";

    //   spyOn(component, 'login').and.callThrough();
    //   loginServiceSpy = spyOn(loginService, 'login').and.returnValue(of({username: validUserName, password: validPassword}));      
     
    //   component.loginForm.get('username').setValue(validUserName);
    //   component.loginForm.get('password').setValue(validPassword);
    //   fixture.detectChanges();   
    //   //de.query(By.css('#login-btn')).triggerEventHandler('click', null);
    //   //fixture.detectChanges();
    //   de.nativeElement.querySelector('#login-btn').click();

    //   expect(component.login).toHaveBeenCalled();
    //   tick();
    //   expect(loginService.login).toHaveBeenCalledWith(validUserName, validPassword);
    //   let userLoginLocalStorageItem = JSON.parse(localStorage.getItem("userLogin"));
    //   expect(userLoginLocalStorageItem.username).toBe(validUserName);
    //   expect(userLoginLocalStorageItem.password).toBe(validPassword);

    //   expect(location.path()).toBe('/dashboard');
    // }));

    // xit('should', async(() => {
    //   spyOn(component, 'login');
    
    //   let button = fixture.debugElement.nativeElement.querySelector('#login-btn');
    //   button.click();
    //   fixture.detectChanges();
    
    //   fixture.whenStable().then(() => {
    //     expect(component.login).toHaveBeenCalled();
    //   });
    // }));

    // xit('should', () => {
    //   spyOn(component, 'login2').and.callThrough();
    //   spyOn(loginService, 'test').and.callThrough().and.returnValue(true);
    
    //   let button = fixture.debugElement.nativeElement.querySelector('#login-btn2');
    //   button.click();
    //   fixture.detectChanges();
    
    //   //fixture.whenStable().then(() => {
    //     expect(component.login2).toHaveBeenCalled();
    //     expect(loginService.test).toHaveBeenCalled();
    //   //});
    // });

  });
});
