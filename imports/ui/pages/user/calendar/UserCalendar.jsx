import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import { Session } from 'meteor/session';
import React from 'react';
import moment from 'moment';
import Loading from '../../../components/Loading.js';
import './UserCalendar.css';

class UserCalendar extends React.Component {

  componentDidMount() {
    if (Meteor.user() && Object.keys(Meteor.user()).length > 0) {
      this.setCalendarData();
    }
  }

  componentDidUpdate() {
    if (Meteor.user() && Object.keys(Meteor.user()).length > 0) {
      this.setCalendarData();
    }
  }

  setCalendarData() {
    $('#calendar').fullCalendar({
      defaultView: 'basicWeek',
      header: {
        left: 'today,prev,next',
        right: 'month,basicWeek,basicDay',
        center: 'title',
      },
      eventClick(event) {
        const eventDate = event.start;
        const todaysDate = moment();
        if (todaysDate.format('LL') === eventDate.format('LL')) {
          const query = Meteor.users.find(
            {
              _id: Meteor.userId(),
              'completedtasks.date': event.start.format('YYYY-MM-DD'),
              'completedtasks.event.id': event.id,
            },
          );
          if (query && query.count() > 0) {
            Bert.alert("You've already completed this task.", 'info');
          } else {
            const task = { id: event.id,
              title: event.title,
              duration: event.duration,
              date: eventDate.format('YYYY-MM-DD'),
            };
            Session.setPersistent('task', task);
            browserHistory.push('/dashboard/tasktimer');
          }
        } else {
          Bert.alert('Only today\'s task can be started.', 'warning');
        }
      },
      eventRender(event, element) {
        const query = Meteor.users.find(
          {
            _id: Meteor.userId(),
            'completedtasks.date': event.start.format('YYYY-MM-DD'),
            'completedtasks.event.id': event.id,
          },
        );
        if (query && query.count() > 0) {
          element.addClass('completedtask');
          element.css({ 'background-color': '#333' });
        }
        if ($('#calendar').fullCalendar('getView').type === 'basicDay') {
          element.css({ height: '50px', 'font-size': '15px' });
        } else if ($('#calendar').fullCalendar('getView').type === 'basicWeek') {
          element.css({ height: '30px', 'font-size': '15px' });
        }
      },
    });
    const currentUser = Meteor.user();
    if (currentUser.workoutplan && (currentUser.workoutplan).length > 0) {
      const events = currentUser.workoutplan;
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar('addEventSource', events);
      $('#calendar').fullCalendar('rerenderEvents');
    }
  }

  render() {
    if (!Meteor.user()) {
      return (
            <div className="UserCalendar">
              <div className="col-xs-offset-5 col-sm-offset-6 animated fadeIn" style={{ paddingTop: '20px', paddingBottom: '20px' }}><Loading/></div>
            </div>
      );
    }

    return (
        <div className="UserCalendar">
          <div id="calendar"></div>
        </div>
    );
  } // end render

} // end class


export default createContainer(() => {
  Meteor.subscribe('users');
  Meteor.subscribe('fiveByFive');
  Meteor.subscribe('ppl');
  Meteor.subscribe('weightLoss');
  return {
    currentUser: Meteor.user(),
  };
}, UserCalendar);
