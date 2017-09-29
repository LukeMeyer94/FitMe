/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, global-require */

describe('Dashboard', function () {
  beforeEach(function () {

  });

  it('should redirect to login if no user is logged in @watch', function () {
    browser.url('http://localhost:3000/');
    browser.deleteCookie();
    browser.localStorage('DELETE');
    server.execute(function () {
      const { Meteor } = require('meteor/meteor');

      const user = Meteor.users.findOne({ 'emails.address': 'carl.winslow@abc.com' });
      if (user) {
        Meteor.users.remove(user._id);
      }
    });

    browser.url('http://localhost:3000/dashboard');
    browser.waitForExist('.login');

    expect(browser.getUrl()).to.equal('http://localhost:3000/login');
  });

  it('should redirect to dashboard after login @watch', function () {
    server.execute(function () {
      const { Meteor } = require('meteor/meteor');

      const user = Meteor.users.findOne({ 'emails.address': 'carl.winslow@abc.com' });
      if (user) {
        Meteor.users.remove(user._id);
      }
    });

    server.execute(function () {
      const { Accounts } = require('meteor/accounts-base');

      Accounts.createUser({
        email: 'carl.winslow@abc.com',
        password: 'bigguy1989',
        profile: {
          name: { first: 'Carl', last: 'Winslow' },
        },
      });
    });

    browser.url('http://localhost:3000/login')
           .setValue('[name="emailAddress"]', 'carl.winslow@abc.com')
           .setValue('[name="password"]', 'bigguy1989')
           .submitForm('form');

    browser.waitForExist('.dashboard');
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard');
  });

  it('should render overview page when dashboard/overview page is visited @watch', function () {
    browser.waitForExist('a#overview-tab-button');
    browser.click('a#overview-tab-button');
    browser.waitForExist('.overview-page');
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/overview');
  });

  it('should render user info page when dashboard/userinfo page is visited @watch', function () {
    browser.waitForExist('a#userinfo-tab-button');
    browser.click('a#userinfo-tab-button');
    browser.waitForExist('.UserInfo');
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/userinfo');
  });
});
