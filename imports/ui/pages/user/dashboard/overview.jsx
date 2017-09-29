import { Meteor } from 'meteor/meteor';
import React from 'react';
import TodoTaskCard from './TodoTaskCard.jsx';
import TasksDoneCard from './TasksDoneCard.jsx';
import TasksSoFarCard from './TasksSoFarCard.jsx';
import Loading from '../../../components/Loading.js';
import './Overview.css';

class Overview extends React.Component {

  componentDidMount() {
    if (Session.get('animateChild')) {
      $('.overview-page').addClass('ng-enter');
      setTimeout(() => {
        $('.overview-page').addClass('ng-enter-active');
      }, 300);
      setTimeout(() => {
        $('.overview-page').removeClass('ng-enter');
        $('.overview-page').removeClass('ng-enter-active');
      }, 600);
    }
  }

  render() {
    if (!Meteor.user()) {
      return (
        <div className="MyPlancol-xs-offset-5 col-sm-offset-6 animated fadeIn" style={{ paddingTop: '20px', paddingBottom: '20px' }}><Loading/></div>
      );
    }

    if (Meteor.user().services && Meteor.user().services.facebook) {
      return (
        <div className="overview animated slideInDown">
          <div className="overview-page" key="overview">
            <div className="jumbotron" style={{ width: '100%' }}>
              <h1>Welcome!</h1>
              This is going to be your dashboard where you can glance your fitness information.
              <br/><br/>
              <TodoTaskCard/>
              <TasksDoneCard/>
              <TasksSoFarCard/>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="overview animated slideInDown">
        <div className="overview-page" key="overview">
          <div className="jumbotron" style={{ width: '100%' }}>
            <h1>Welcome!</h1>
            This is going to be your dashboard where you can glance your fitness information.
            <br/><br/>
            <TodoTaskCard/>
            <TasksDoneCard/>
            <TasksSoFarCard/>
            <br/><br/>
            Login to your facebook account to link this app with your social profile!
            Social -> FbConnect
            <br /><br />
          </div>
        </div>
      </div>
    );
  }
}

export default Overview;
