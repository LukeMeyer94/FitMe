import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Table, Form, FormControl, FormGroup, ControlLabel, Button, Modal, Glyphicon } from 'react-bootstrap';
import React from 'react';
import TimePicker from 'antd/lib/time-picker';
import 'antd/lib/time-picker/style/index.less';
import 'antd/lib/style/core/motion.less';
import './MyPlan.scss';
import Loading from '../../../components/Loading.js';


class MyPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.addTaskHandleSubmit = this.addTaskHandleSubmit.bind(this);
    this.updateTableData = this.updateTableData.bind(this);
    this.removeAllTasks = this.removeAllTasks.bind(this);
  }

  componentDidMount() {
    this.updateTableData();
  }

  componentDidUpdate() {
    this.updateTableData();
  }

  modalOpen() {
    this.setState({ showModal: true });
  }

  modalClose() {
    this.setState({ showModal: false });
  }

  updateTableData() {
    if (Meteor.user()) {
      const currentUser = Meteor.user();
      let tableRows = '';
      if (currentUser.workoutplan && (currentUser.workoutplan).length > 0) {
        for (const i in currentUser.workoutplan) {
          const e = currentUser.workoutplan[i];
          let days = '';
          for (const j in e.dow) {
            const dayNumber = e.dow[j];
            if (dayNumber === 0) days += 'Sunday, ';
            if (dayNumber === 1) days += 'Monday, ';
            if (dayNumber === 2) days += 'Tuesday, ';
            if (dayNumber === 3) days += 'Wednesday, ';
            if (dayNumber === 4) days += 'Thursday, ';
            if (dayNumber === 5) days += 'Friday, ';
            if (dayNumber === 6) days += 'Saturday, ';
          }
          days = days.substring(0, days.length - 2);
          const rowD = `<tr><td>${e.title}</td>\
                          <td>${e.duration} minutes</td>\
                          <td>${days}</td>\
                          <td><button class=removeTask id=rm_${i}><span class='glyphicon glyphicon-trash' id=rm_${i}></span></button></td>\
                      </tr>`;
          tableRows += rowD;
        }
        $('#planTable tbody').html(tableRows);
        $('.removeTask').click((e) => {
          this.removeTaskHandler(e);
        });
      } else {
        $('#planTable tbody').html('');
      }
    }
  }

  addTaskHandleSubmit(event) {
    event.preventDefault();
    let shouldSubmit = true;

    if (!$('#addTaskName').val().length > 0) {
      shouldSubmit = false;
      Bert.alert('Please provide a name for the task', 'default', 'growl-top-right');
    }
    if (!$('.addTaskDuration input').val().length > 0 && parseInt($('.addTaskDuration input').val(), 10) > 0) {
      shouldSubmit = false;
      Bert.alert('Please choose a duration for the task', 'danger', 'growl-top-right');
    }
    const dow = [];
    for (let i = 0; i <= 6; i++) {
      if ($(`#wd-${i}`)[0].checked) {
        dow.push(i);
      }
    }
    if (!dow.length > 0) {
      Bert.alert('Choose on which days the task needs to repeat', 'danger');
      shouldSubmit = false;
    }

    if (shouldSubmit === true) {
      Meteor.subscribe('users');

      const id = Date.now();

      const e = {
        id,
        title: $('#addTaskName').val(),
        dow,
        allDay: true,
        duration: $('.addTaskDuration input').val(),
        className: 'calendarEvent',
      };
      Meteor.call('updateUserWorkout', Meteor.userId(), e, 'insert', (error, result) => {
        if (result === 'done') {
          Bert.alert('Task added to Workout Plan', 'success');
          this.modalClose();
          this.updateTableData();
        } else {
          Bert.alert('Some error, try again', 'warning');
        }
      });
    }
  }

  removeAllTasks() {
    for (let i = $('#planTable > tbody > tr').length - 1; i >= 0; i--) {
      const requestEvent = { id: i };
      Meteor.call('updateUserWorkout', Meteor.userId(), requestEvent, 'delete', (error, result) => {
        if (result !== 'done') {
          Bert.alert('Some error, try again', 'warning');
        }
      });
    }
    Bert.alert('Tasks removed from Workout Plan', 'success');
    this.updateTableData();
    Meteor.users.update({ _id: Meteor.userId() }, { $set: {
      'profile.planAccepted': false,
    },
    });
  }

  removeTaskHandler(event) {
    event.preventDefault();
    const requestEvent = { id: event.target.id.split('_')[1] };
    Meteor.call('updateUserWorkout', Meteor.userId(), requestEvent, 'delete', (error, result) => {
      if (result === 'done') {
        Bert.alert('Task removed from Workout Plan', 'success');
        this.updateTableData();
      } else {
        Bert.alert('Some error, try again', 'warning');
      }
    });
  }

  render() {
    if (!Meteor.user()) {
      return (
        <div className="MyPlancol-xs-offset-5 col-sm-offset-6 animated fadeIn" style={{ paddingTop: '20px', paddingBottom: '20px' }}><Loading/></div>
      );
    }

    const pan = () => (
            <Button size="small" onClick={(() => $('#addTaskName').click())}>
              Ok
            </Button>
          );


    this.updateTableData();
    return (
        <div className='MyPlan'>
          <Button className='taskButtons' id='addTaskButton' onClick={this.modalOpen}>
            Add task <Glyphicon glyph="plus"/>
          </Button>
          <Button className='taskButtons' id='removeAllTasksButton' onClick={this.removeAllTasks}>
            Remove all tasks
          </Button>
          <Modal show={this.state.showModal} onHide={this.modalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add new task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.addTaskHandleSubmit} id='addTaskForm'>
                <FormGroup id="addTaskNameGroup">
                  <ControlLabel>Give a name to your task</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder="Enter text"
                    id = 'addTaskName'
                  />
                  <br/>
                  <ControlLabel>Choose duration of task (minutes)</ControlLabel>
                  <br/>
                  <TimePicker format={'mm'} placeholder="Select a time" size="large" className="addTaskDuration"
                    addon={pan}
                  />
                  <br/>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Choose day(s) you would like the task to be repeated</ControlLabel>
                  <br/>
                  <div className="weekDays-selector">
                    <input type="checkbox" id="wd-1" className="weekday" />
                    <label htmlFor='wd-1'>M</label>
                    <input type="checkbox" id="wd-2" className="weekday" />
                    <label htmlFor='wd-2'>Tu</label>
                    <input type="checkbox" id="wd-3" className="weekday" />
                    <label htmlFor='wd-3'>We</label>
                    <input type="checkbox" id="wd-4" className="weekday" />
                    <label htmlFor='wd-4'>Th</label>
                    <input type="checkbox" id="wd-5" className="weekday" />
                    <label htmlFor='wd-5'>Fr</label>
                    <input type="checkbox" id="wd-6" className="weekday" />
                    <label htmlFor='wd-6'>Sa</label>
                    <input type="checkbox" id="wd-0" className="weekday" />
                    <label htmlFor='wd-0'>Su</label>
                  </div>
                </FormGroup>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle='success' type="submit" form='addTaskForm'>Add Task</Button>
              <Button onClick={this.modalClose}>Close</Button>
            </Modal.Footer>
          </Modal>
          <Table striped bordered condensed hover id='planTable'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Recurrence</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody></tbody>
          </Table>
        </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('users');
  Meteor.subscribe('fiveByFive');
  Meteor.subscribe('ppl');
  Meteor.subscribe('weightLoss');
  return {
    users: Meteor.users,
    currentUser: Meteor.user(),
  };
}, MyPlan);
