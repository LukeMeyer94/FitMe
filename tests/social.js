/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, , global-require */

describe('Social', function () {
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
    browser.url('http://localhost:3000/dashboard/friendsearch');
    browser.waitForExist('.login', 2000);

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
          bio: { location: 'Fitness East Recreational Facilty, Iowa City, IA, United States' },
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

  it('should render Friend Search page when dashboard/overview page is visited @watch', function () {
    browser.waitForExist('a#friendsearch-tab-button');
    browser.click('a#friendsearch-tab-button');
    browser.waitForExist('#friend-search-list');
    browser.waitForExist('#facebook-friend-list');
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/social');
  });

  it('should render Friend List page when dashboard/overview page is visited @watch', function () {
    browser.waitForExist('a#uitabs-tab-4');
    browser.click('a#uitabs-tab-4');
    browser.waitForExist('#pending-friends-list');
    browser.waitForExist('#friends-list');
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/social');
  });

  it('should validate Facebook connect page @watch', function () {
    browser.waitForVisible('a#uitabs-tab-2');
    browser.click('a#uitabs-tab-2');
    browser.waitForExist('#facebookCon');
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/social');
  });

  it('should validate share to Facebook page @watch', function () {
    browser.waitForVisible('a#uitabs-tab-3');
    browser.click('a#uitabs-tab-3');
    browser.waitForExist('#shareToFb');
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/social');
  });
});
