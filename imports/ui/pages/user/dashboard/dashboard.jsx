import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';
import './dashboard.less';
import Overview from './overview.jsx';
import WorkoutPlan from '../workoutplan/WorkoutPlan.jsx';
import UserCalendar from '../calendar/UserCalendar.jsx';
import UserInfo from '../info/UserInfo.jsx';
import Social from '../social/Social.jsx';
// const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import TaskTimer from '../../task/TaskTimer.jsx';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      profilePicURL: '',
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.navigateToTab = this.navigateToTab.bind(this);
  }

  componentWillMount() {
    if (!Meteor.userId()) {
      browserHistory.push('/login');
    } else {
      this.profilePicURL();
    }
  }

  componentDidUpdate() {
    if (Meteor.userId()) {
      this.profilePicURL();
    }
  }

  handleLogout(e) {
    e.preventDefault();
    Meteor.logout();
    Session.clear();
    browserHistory.push('/login');
  }

  navigateToTab(e, tab) {
    e.preventDefault();
    browserHistory.push(tab);
  }

  getTabContent() {
    let tabContent = '';
    if (Object.keys(this.props.params).length > 0) {
      const tabName = this.props.params.tab;
      if (tabName.toLowerCase() === 'overview') {
        tabContent = <Overview/>;
      } else if (tabName.toLowerCase() === 'workoutplan') {
        tabContent = <WorkoutPlan/>;
      } else if (tabName.toLowerCase() === 'calendar') {
        tabContent = <UserCalendar/>;
      } else if (tabName.toLowerCase() === 'userinfo') {
        tabContent = <UserInfo/>;
      } else if (tabName.toLowerCase() === 'social') {
        tabContent = <Social/>;
      } else if (tabName.toLowerCase() === 'tasktimer') {
        tabContent = <TaskTimer/>;
      }
    } else {
      tabContent = <Overview/>;
    }
    return tabContent;
  }

  userName() {
    const user = Session.get('username');
    const name = user || '';
    return user ? `${name.first} ${name.last}` : '';
  }

  profilePicURL() {
    if (Meteor.user()) {
      if (this.state.profilePicURL !== Meteor.user().profile.picture) {
        this.setState({ profilePicURL: Meteor.user().profile.picture });
      }
    }
  }

  render() {
    return (
      <div className="dashboard">
        <div className="dashboard-page ui-view">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-3 col-sm-3 col-md-2 col-lg-2 sidebar">
                <div className="text-center">
                  <h2 className="brand">{this.userName()}</h2>
                  <div style={{ margin: '0 auto', maxHeight: '150px', maxWidth: '150px' }}>
                    <img src={this.state.profilePicURL} className="user-avatar img-responsive img-circle" style={{ margin: '0 auto', display: 'inline-block' }} />
                  </div>
                  <br />
                  <a href="#" className="user-logout btn" onClick={ this.handleLogout }>Logout</a>
                </div>

                <ul className="nav nav-sidebar">
                  <li>
                    <a id='overview-tab-button' onClick={e => this.navigateToTab(e, '/dashboard/overview')}>Overview</a>
                  </li>
                  <li>
                    <a id='friendsearch-tab-button' onClick={e => this.navigateToTab(e, '/dashboard/social')}>Social</a>
                  </li>
                  <li>
                    <a id='workoutplan-tab-button' onClick={e => this.navigateToTab(e, '/dashboard/workoutplan')}>Workout Plan</a>
                  </li>
                  <li>
                    <a id='usercalendar-tab-button' onClick={e => this.navigateToTab(e, '/dashboard/calendar')}>Calendar</a>
                  </li>
                  <li>
                    <a id='userinfo-tab-button' onClick={e => this.navigateToTab(e, '/dashboard/userinfo')}>User Info</a>
                  </li>
                </ul>
              </div>

              <div className="
                    main col-xs-9
                    col-xs-push-3
                    col-sm-9
                    col-sm-push-3
                    col-md-10
                    col-md-push-2
                    col-md-push-2
                    col-lg-10
                    col-lg-push-2">
                {React.cloneElement(this.getTabContent() || <div />)}
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

Dashboard.propTypes = {
  params: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('users');
  Meteor.subscribe('fiveByFive');
  Meteor.subscribe('ppl');
  Meteor.subscribe('weightLoss');
  return {
    currentUser: Meteor.user(),
  };
}, Dashboard);
