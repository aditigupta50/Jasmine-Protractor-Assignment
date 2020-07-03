import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {Location} from "@angular/common";
import { LoginService } from './login.service';
import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { RouterTestingModule } from '@angular/router/testing';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent }
];

describe('LoginService', () => {
  let service: LoginService;
  let validUserName = "validuser1";
  let validPassword = "TestPassword@123";
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
    })
    service = TestBed.get(LoginService);
    location = TestBed.get(Location);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Testing login function', () => {

    describe('When login function is called with valid credentials', () => {
      it('Local storage is set with user data', () => {
        expect(JSON.parse(localStorage.getItem("userLogin"))).toBeNull();
    
        service.login(validUserName, validPassword);

        expect(JSON.parse(localStorage.getItem("userLogin"))).toBeTruthy();
        expect(JSON.parse(localStorage.getItem("userLogin")).username).toBe(validUserName);
        expect(JSON.parse(localStorage.getItem("userLogin")).password).toBe(validPassword);
      });
      
      it('should return an observable of user data', () => {
        expect(JSON.parse(localStorage.getItem("userLogin"))).toBeNull();
        
        service.login(validUserName, validPassword).subscribe(result => {
          expect(result).toEqual({ username: validUserName, password: validPassword});
        });
        
      });
    });

    describe('When login function is called with invalid credentials', () => {
      it('Local storage is not set with user data', () => {
        expect(JSON.parse(localStorage.getItem("userLogin"))).toBeNull();
    
        service.login(validUserName, "invalidpassword");
    
        expect(JSON.parse(localStorage.getItem("userLogin"))).toBeNull();
      });
      
      it('should throw an error', () => {
        expect(JSON.parse(localStorage.getItem("userLogin"))).toBeNull();
        
        service.login(validUserName, "invalidpassword").subscribe(
          result => {}, 
          error => {
            expect(error).toEqual(new Error("Invalid user"));
          }
        );        
      });
    });
  });

  describe('Testing logout function', () => {
    it('should remove user data from local storage', () => {
      localStorage.setItem("userLogin", JSON.stringify({username: validUserName, password: validPassword}));
      expect(JSON.parse(localStorage.getItem("userLogin"))).toBeTruthy();
      service.logout();
      expect(JSON.parse(localStorage.getItem("userLogin"))).toBeNull();
    });
    it('Should re-direct to homepage', fakeAsync(() => {
      service.logout();
      tick();
      expect(location.path()).toBe('/home');
    }));
  });

  describe('Testing isLoggedIn function', () => {
    it('should set isUserLoggedIn with userdata if local storage has userdata', () => {
      localStorage.setItem("userLogin", JSON.stringify({username: validUserName, password: validPassword}));
      service.isLoggedIn();
      service.isUserLoggedIn$.subscribe(res => {
        expect(res).toEqual({ username: validUserName, password: validPassword});
      });
    });

    it('should set isUserLoggedIn to false if local storage does not have userdata', () => {
      if(localStorage.getItem("userLogin")){
        localStorage.removeItem("userLogin");
      }
      service.isLoggedIn();
      service.isUserLoggedIn$.subscribe(res => {
        expect(res).toBeFalsy();
      })
    });
  });
});
