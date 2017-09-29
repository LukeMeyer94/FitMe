import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import { Session } from 'meteor/session';
import { Button, Glyphicon } from 'react-bootstrap';
import React from 'react';
import Loading from '../../components/Loading.js';
import './TaskTimer.scss';

class TaskTimer extends React.Component {
  constructor(props) {
    super(props);

    this.timer = null;
    this.duration = 1;
    this.task = Session.get('task');
    Session.clear('task');

    this.timerPlayBack = this.timerPlayBack.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.markAsDone = this.markAsDone.bind(this);
  }

  componentWillMount() {
    if (!this.task) {
      browserHistory.push('/dashboard/calendar');
    }
  }

  componentDidMount() {
    if (Meteor.user() && Object.keys(Meteor.user()).length > 0) {
      this.setTimer();
    }
  }

  componentDidUpdate() {
    if (Meteor.user() && Object.keys(Meteor.user()).length > 0) {
      this.setTimer();
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }
  }

  setTimer() {
    if (!this.timer && this.task) {
      const durationSeconds = (parseInt(this.task.duration, 10) * 60);
      this.duration += durationSeconds;
      /* eslint-disable new-cap */
      this.timer = $('#timer').FlipClock(durationSeconds, {
        autoStart: false,
        countdown: true,
        clockFace: 'MinuteCounter',
        callbacks: {
        /* eslint-disable func-names */
          interval: (function () {
            this.duration -= 1;
            if (this.duration === 0) {
              Meteor.call('updateCompletedTask', Meteor.userId(), this.task, 'insert', (error, result) => {
                if (result === 'done') {
                  $('#resetButton').remove();
                  Bert.alert('Task status updated', 'success');
                  $('#timerPlaybackButton').html('Task Done');
                }
              });
            }
          }).bind(this),
        },
        /* eslint-enable func-names */
        /* eslint-enable new-cap */
      });
    }
  }

  timerPlayBack() {
    if (this.timer) {
      if ($('#timerPlaybackButton').html() === 'Task Done') {
        Bert.alert('Woohoo!');
      } else if (this.timer.running) {
        this.timer.stop();
        $('#timerPlaybackButton').html('<span class="glyphicon glyphicon-play"/> Start');
      } else {
        this.timer.start();
        $('#timerPlaybackButton').html('<span class="glyphicon glyphicon-pause"/> Pause');
      }
    }
  }

  resetTimer() {
    if (this.timer) {
      const taskDuration = [parseInt(this.task.duration.split(':')[0], 10),
        parseInt(this.task.duration.split(':')[1], 10)];
      const durationSeconds = (taskDuration[0] * 3600) + (taskDuration[1] * 60);
      this.timer.setTime(durationSeconds);
    }
  }

  markAsDone() {
    /* eslint-disable no-alert */
    this.timer.stop();
    this.timer.setTime(0);
    if (confirm('This would mark the current task as complete')) {
      Meteor.call('updateCompletedTask', Meteor.userId(), this.task, 'insert', (error, result) => {
        if (result === 'done') {
          $('#resetButton').remove();
          $('#markDoneButton').remove();
          Bert.alert('Task status updated', 'success');
          $('#timerPlaybackButton').html('Task Done');
        }
      });
    }
    /* eslint-enable no-alert */
  }

  render() {
    if (!Meteor.user() || Object.keys(Meteor.user()).length < 1) {
      return (
        <div className='TaskTimer'>
          <div className='col-xs-offset-5 col-sm-offset-6 animated fadeIn' style={{ paddingTop: '20px', paddingBottom: '20px' }}><Loading/></div>
        </div>
      );
    }

    return (
      <div className='TaskTimer'>
        <div className='timerContainer'>
          <div id='taskTitle'>{this.task ? this.task.title : ''}</div>
          <div id='timer'></div>
          <br/>
          <Button
            className='timerButtons'
            id='timerPlaybackButton'
            onClick={ this.timerPlayBack }>
              <Glyphicon glyph='play'/> Start
          </Button>
          <Button
            className='timerButtons'
            id='resetButton'
            onClick={ this.resetTimer }>
              <Glyphicon glyph='repeat'/> Reset
          </Button>
          <br/>
          <br/>
          <Button
            className='timerButtons'
            id='markDoneButton'
            onClick={ this.markAsDone }
            bsSize='xsmall'>
            Mark Task as Done
          </Button>

        </div>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('users');

  return {
    currentUser: Meteor.user(),
  };
}, TaskTimer);
