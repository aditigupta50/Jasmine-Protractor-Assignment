import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get(browser.baseUrl+'login') as Promise<any>;
  }

  getTitleText() {
    return element(by.css('#login-title')).getText() as Promise<string>;
  }

  getForm() {
    return element(by.tagName('form'));
  }

  getUsernameTextbox() {
    return element(by.id('username'));
  }

  getPasswordTextbox() {
    return element(by.id('password'));
  }

  getLoginButton() {
    return element(by.id('login-btn'));
  }
}
