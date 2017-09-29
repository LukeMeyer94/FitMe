/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, global-require */

describe('UserInfo Page', function () {
  beforeEach(function () {

  });

  it('should navigate to User Info Tabs @watch', function () {
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

    browser.waitForExist('.dashboard', 2000);
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard');
  });

  it('should validate Account page @watch', function () {
    browser.url('http://localhost:3000/dashboard/userinfo');

    browser.waitForVisible('a#uitabs-tab-1', 2000);
    browser.click('a#uitabs-tab-1');

    browser.waitForVisible('#accountForm', 5000);
    browser.setValue('#firstName', 'Toto')
      .setValue('#lastName', 'Tutu')
      .submitForm('#accountForm');

    browser.waitForExist('.success', 2000);

    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/userinfo');
  });

  it('should validate Bio page @watch', function () {
    browser.url('http://localhost:3000/dashboard/userinfo');

    browser.waitForVisible('a#uitabs-tab-2', 2000);
    browser.click('a#uitabs-tab-2');

    browser.waitForVisible('#bioform', 2000);
    browser.setValue('#geosuggest', 'Fitness East Recreational Facilty')
      .waitForVisible('#bioform > div:nth-child(2) > div > div.geosuggest__suggests-wrapper > ul > li.geosuggest__item', 2000);
    browser.click('#bioform > div:nth-child(2) > div > div.geosuggest__suggests-wrapper > ul > li.geosuggest__item');
    browser.setValue('#weight', '95')
      .setValue('#age', '22')
      .setValue('#height_ft', '5')
      .setValue('#height_in', '10')
      .submitForm('#bioform');

    browser.waitForExist('.success', 2000);

    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/userinfo');
  });

  it('should validate TDEECalc page @watch', function () {
    browser.url('http://localhost:3000/dashboard/userinfo');

    browser.waitForVisible('a#uitabs-tab-3', 2000);
    browser.click('a#uitabs-tab-3');

    browser.waitForVisible('#formInlineStats', 2000);

    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/userinfo');
  });

  it('should calculate an appropriate TDEE @watch', function () {
    browser.setValue('[name="heightFt"]', '5')
      .setValue('[name="heightIn"]', '10')
      .setValue('[name="weight"]', '195')
      .setValue('[name="age"]', '22')
      .click('#maleSelector')
      .submitForm('#tddform');

    expect(browser.getValue('[name="TDEE"]')).to.equal('3232');
  });
});
