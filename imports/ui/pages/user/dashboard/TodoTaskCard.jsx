import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import moment from 'moment';
import Loading from '../../../components/Loading.js';


class TodoTaskCard extends React.Component {

  render() {
    if (!Meteor.user()) {
      return (
        <div className="DashboardCard Card">
          <div className="col-xs-offset-5 animated fadeIn" style={{ paddingTop: '28%' }}><Loading/></div>
        </div>
      );
    }

    let tasksToDo = 0;
    const todayIndex = (new Date()).getDay();
    const workoutplan = Meteor.user().workoutplan;
    for (const i in workoutplan) {
      const presence = workoutplan[i].dow.indexOf(todayIndex);
      if (presence > -1) {
        tasksToDo += 1;
      }
    }
    const tasksDone = Meteor.users.find({ _id: Meteor.userId(), 'completedtasks.date': moment().format('YYYY-MM-DD') }).count();
    tasksToDo -= tasksDone;
    if (tasksToDo < 0) {
      tasksToDo = 0;
    }

    return (
      <div className="DashboardCard Card">
        <div className='cardText'>Tasks ToDo Today</div>
        <div className="cardValue">{tasksToDo}</div>
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
}, TodoTaskCard);
