/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

describe('Index Page', function () {
  beforeEach(function () {
  });

  it('should render index page on / @watch', function () {
    browser.url('http://localhost:3000/');
    browser.waitForExist('.Index');
  });
  it('should render signup when signup button clicked @watch', function () {
    browser.url('http://localhost:3000/');
    browser.click('a#index-signup-button');
    expect(browser.getUrl()).to.equal('http://localhost:3000/signup');
  });
});
