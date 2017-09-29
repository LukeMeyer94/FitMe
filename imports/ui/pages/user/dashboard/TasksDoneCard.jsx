import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import moment from 'moment';
import Loading from '../../../components/Loading.js';


class TasksDoneCard extends React.Component {

  render() {
    if (!Meteor.user()) {
      return (
        <div className="DashboardCard Card">
          <div className="col-xs-offset-5 animated fadeIn" style={{ paddingTop: '28%' }}><Loading/></div>
        </div>
      );
    }

    const tasksDone = Meteor.users.find({ _id: Meteor.userId(), 'completedtasks.date': moment().format('YYYY-MM-DD') }).count();

    return (
      <div className="DashboardCard Card">
        <div className='cardText'>Tasks Done Today</div>
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
}, TasksDoneCard);
