/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, global-require */

describe('Workout Plan', function () {
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
    browser.url('http://localhost:3000/dashboard/workoutplan');

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
          bio: { age: '22', goal: 'Muscle Gain', heightFt: '5', heightIn: '10' },
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

  it('should render Workoutplan page when dashboard/overview page is visited @watch', function () {
    browser.waitForExist('a#workoutplan-tab-button');
    browser.click('a#workoutplan-tab-button');
    browser.waitForExist('.WorkoutPlan');
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/workoutplan');
  });

  it('should show the appropriate message for the users goal @watch', function () {
    browser.waitForExist('#wptabs-tab-2');
    browser.click('#wptabs-tab-2');
    browser.waitForExist('#muscleGainPlan');
    expect(browser.getUrl()).to.equal('http://localhost:3000/dashboard/workoutplan');
  });

  it('should allow the user to add a plan to their custom plan @watch', function () {
    browser.waitForVisible('#addRoutineButton', 2000);
    browser.click('#addRoutineButton');
    browser.waitForExist('.success', 2000);
    browser.click('#wptabs-tab-1');
    expect(browser.getValue('#planTable > tbody > tr').length).to.equal(10);
  });

  it('should automatically add their plan to their calendar @watch', function () {
    browser.waitForVisible('#usercalendar-tab-button', 2000);
    browser.click('#usercalendar-tab-button');
    browser.waitForVisible('#calendar', 2000);
    const fiveByFiveArray = ['Barbell Row', 'Deadlift', 'Barbell Row', 'Sprints', 'Bench Press', 'Overhead Press', 'Bench Press', 'Squat', 'Squat', 'Squat'];
    fiveByFiveArray.forEach((task, idx) => {
      expect(browser.getText('.fc-title')[idx]).to.equal(task);
    });
  });
});
