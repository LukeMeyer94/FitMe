import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Meteor } from 'meteor/meteor';
import { Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import Loading from '../../../components/Loading.js';
import './FitMePlan.scss';

let routine = null;
let routineName = null;
let divId = 'noPlan';
class FitMePlan extends React.Component {

  constructor(props) {
    super(props);
    this.addRoutine = this.addRoutine.bind(this);
  }

  addRoutine() {
    if (Meteor.user().profile.planAccepted) {
      Bert.alert('You have already added a plan to your calendar', 'warning');
      return;
    }
    if (!routine) {
      Bert.alert('Something went wrong', 'warning');
      return;
    }
    routine.forEach((day, idx) => {
      const dow = [idx];
      if (day.tasks) {
        let dateBuffer = 0;
        const currentDate = Date.now();
        day.tasks.forEach((task) => {
          const id = currentDate + dateBuffer;
          dateBuffer += 1111;
          const e = {
            id,
            title: task.name,
            dow,
            allDay: true,
            duration: task.duration,
            className: 'calendarEvent',
          };

          Meteor.call('updateUserWorkout', Meteor.userId(), e, 'insert', (error, result) => {
            if (result !== 'done') {
              Bert.alert('Something went wrong', 'warning');
            }
          });
        });
        Bert.alert('Tasks added to Workout Plan', 'success');
      }
    });
    Meteor.users.update({ _id: Meteor.userId() }, { $set: {
      'profile.planAccepted': true,
    },
    });
  }


  render() {
    const currentUser = Meteor.user();
    if (!Meteor.user()
      || !FiveByFive.find().count()
      || !PPL.find().count()
      || !WeightLoss.find().count()) {
      return (<div className="col-xs-offset-6 animated fadeIn"><Loading/></div>);
    }
    let goal = '';
    if (currentUser.profile.bio && currentUser.profile.bio.goal) {
      goal = currentUser.profile.bio.goal;
    }
    const divStyle = {
      marginTop: '100px',
      height: '200px',
      width: 'auto',
      color: '#777',
    };
    if (goal === 'Muscle Gain') {
      routine = FiveByFive.find().fetch();
      routineName = '5x5 Stronglifts';
      divId = 'muscleGainPlan';
    } else if (goal === 'Weight Loss') {
      routine = WeightLoss.find().fetch();
      routineName = 'Total Body Lifts/Cardio';
      divId = 'weightLossPlan';
    } else if (goal === 'Improve Overall Fitness') {
      routine = PPL.find().fetch();
      routineName = 'Push - Pull - Legs';
      divId = 'improvementPlan';
    } else {
      return (
          <div style={divStyle} id="noGoal" className="animated fadeIn">
            <h5 className='text-center'>
              Update your user bio and we'll suggest a plan for you
            </h5>
          </div>
      );
    }
    const lifts = [];
    routine.forEach((day) => {
      if (day.title !== 'rest day' && day.title !== 'cardio day') {
        lifts.push(day.tasks);
      }
    });
    return (
      <div className="FitMePlan">
        <div id={divId} className="animated fadeIn">
          Your Custom Routine:
          <br />
          {routineName}
          <br /> <br />
          <BootstrapTable data={routine} striped={true}>
            <TableHeaderColumn
              dataField="name"
              width="100"
              isKey={true}
              dataAlign="center">
              Day
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="title"
              width="100"
              dataAlign="center">
              Title
            </TableHeaderColumn>
          </BootstrapTable>
          <br />
          Lifts:
          {
            lifts.map(task =>
              <BootstrapTable data={task} striped={true}>
                <TableHeaderColumn
                  dataField="name"
                  width="150"
                  isKey={true}
                  dataAlign="center">
                  Name
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="reps"
                  width="100"
                  dataAlign="center">
                  Reps
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="sets"
                  width="100"
                  dataAlign="center">
                  Sets
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="duration"
                  width="100"
                  dataAlign="center">
                  Duration
                </TableHeaderColumn>
              </BootstrapTable>,
            )
          }
          <Button id="addRoutineButton" className="col-xs-6
                                                  col-xs-offset-3
                                                  col-sm-4
                                                  col-sm-offset-4"
                                        bsStyle="primary"
                                        onClick={this.addRoutine}>
                                        Add Routine to Calendar
          </Button>
        </div>
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
    fiveByFiveObj: FiveByFive.find().fetch(),
    pplObj: PPL.find().fetch(),
    weightLossObj: WeightLoss.find().fetch(),
  };
}, FitMePlan);
