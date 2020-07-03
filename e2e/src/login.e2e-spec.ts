import { LoginPage } from './login.po';
import { browser, logging, protractor } from 'protractor';

describe('Login Functionality:', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
    page.navigateTo();
  });

  it('should navigate to Login page', () => {
    expect(
        browser.wait(
          protractor.ExpectedConditions.urlContains("login"), 5000
        ).catch(() => {return false})
      ).toBeTruthy(`Url match could not succced`);
  });

  it('should display Login title', () => {
    expect(page.getTitleText()).toEqual('Login');
  });

  it('On page load, form should be invalid and login button should be disabled', () => {
    let form = page.getForm().getAttribute('class');
    expect(form).toContain('ng-invalid');
    expect(page.getLoginButton().isEnabled()).toBeFalsy();
  });

  describe('When form is filled with valid credentials, ', () => {
      let form;
      let validUserName = "validuser1";
      let validPassword = "TestPassword@123";

      beforeEach(() => {
        page.getUsernameTextbox().sendKeys(validUserName);
        page.getPasswordTextbox().sendKeys(validPassword);
        form = page.getForm().getAttribute('class');
      });
    //   afterEach(() => {
    //       form = null;
    //   });
    it('Form becomes valid and Login button gets enabled', () => {
        expect(form).toContain('ng-valid');
        expect(page.getLoginButton().isEnabled()).toBeTruthy();
    });


    describe('When login button is clicked, ', () => {
        let valLocalStorage;
        beforeEach(() => {
            page.getLoginButton().click();            
        });
        afterEach(() => {
            valLocalStorage = browser.executeScript("return window.localStorage.clear();");
        });
        it('Local storage should store the user data', () => {
            valLocalStorage = browser.executeScript("return window.localStorage.getItem('userLogin');");
            expect(valLocalStorage).toEqual(JSON.stringify({username: validUserName, password: validPassword}));
            // let valLocalStorage = browser.executeScript("return JSON.parse(window.localStorage.getItem('userLogin'));");
            // expect(valLocalStorage).toEqual({username: validUserName, password: validPassword});
            // expect(valLocalStorage['username']).toEqual(validUserName)
        });

        it('On successful authentication, user should be re-directed to dashboard screen', () => {
            expect(
                browser.wait(
                  protractor.ExpectedConditions.urlContains("dashboard"), 5000
                ).catch(() => {return false})
              ).toBeTruthy(`Url match could not succced`);
        });
    });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});