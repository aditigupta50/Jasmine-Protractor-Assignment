import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { LoginService } from '../shared/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { DebugElement } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent }
];

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let loginService: LoginService;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent, HomeComponent ],
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [LoginService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.ngOnInit();
    fixture.detectChanges();
    loginService = TestBed.get(LoginService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Login if user is not logged in', () => {
    localStorage.clear();
    loginService.isUserLoggedIn$.subscribe(res => {      
      expect(res).toBeFalsy();
      expect(de.nativeElement.querySelector('#menu-login-txt')).toBeDefined();
      expect(de.nativeElement.querySelector('#menu-logout-txt')).toBeNull();
    })
  });

  it('should display Logout and welcome text with username if user is logged in', fakeAsync(() => {
    loginService.login("validuser1", "TestPassword@123");
    tick();
    fixture.detectChanges();
    loginService.isUserLoggedIn$.subscribe(res => {      
      expect(res).toBeTruthy();
      expect(de.nativeElement.querySelector('#menu-login-txt')).toBeNull();
      expect(de.nativeElement.querySelector('#menu-logout-txt')).toBeDefined();
      expect(de.nativeElement.querySelector('#user-welcome-txt')).toBeDefined();
      expect(de.nativeElement.querySelector('#user-welcome-txt').textContent.includes("Welcome validuser1")).toBeTruthy();
    })
  }));

});
