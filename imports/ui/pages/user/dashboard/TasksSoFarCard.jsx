import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import Loading from '../../../components/Loading.js';


class TasksSoFarCard extends React.Component {

  render() {
    if (!Meteor.user()) {
      return (
        <div className="DashboardCard Card">
          <div className="col-xs-offset-5 animated fadeIn" style={{ paddingTop: '28%' }}><Loading/></div>
        </div>
      );
    }

    let tasksDone = 0;

    if (Meteor.user().completedtasks) {
      tasksDone = Meteor.user().completedtasks.length;
    }

    return (
      <div className="DashboardCard Card">
        <div className='cardText'>Total Tasks Done</div>
        <div className="cardValue">{tasksDone}</div>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('users');

  return {
    users: Meteor.users,
    currentUser: Meteor.user(),
  };
}, TasksSoFarCard);
