import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MenuComponent,
        HomeComponent,
        DashboardComponent,
        LoginComponent
      ],
      imports: [
        //BrowserModule,
        RouterTestingModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // xit(`should have as title 'jasmine-test-code'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('jasmine-test-code');
  // });

  // xit('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('jasmine-test-code app is running!');
  // });

  // xit("test object toBe", () => {
  //   let obj1 = {
  //     a: 2,
  //     b: {
  //       c: 4
  //     }
  //   };
  //   let obj2 = {
  //     a: 2,
  //     b: {
  //       c: 4
  //     }
  //   };
  //   expect(obj1).toBe(obj2);
  // });

  // xit("test object toEqual", () => {
  //   let obj1 = {
  //     a: 2,
  //     b: {
  //       c: 4
  //     }
  //   };
  //   let obj2 = {
  //     a: 2,
  //     b: {
  //       c: 4
  //     }
  //   };
  //   expect(obj1).toEqual(obj2);
  // });

  // xit("test assigned object toBe", () => {
  //   let obj1 = {
  //     a: 2,
  //     b: {
  //       c: 4
  //     }
  //   };
  //   let obj2 = obj1;
  //   expect(obj1).toBe(obj2);
  // });

  // xit("test assigned object toEqual", () => {
  //   let obj1 = {
  //     a: 2,
  //     b: {
  //       c: 4
  //     }
  //   };
  //   let obj2 = obj1;
  //   expect(obj1).toEqual(obj2);
  // });

});
