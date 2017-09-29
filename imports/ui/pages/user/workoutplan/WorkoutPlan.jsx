import { Tabs, Tab } from 'react-bootstrap';
import React from 'react';
import './WorkoutPlan.scss';
import MyPlan from './MyPlan.jsx';
import FitMePlan from './FitMePlan.jsx';

class WorkoutPlan extends React.Component {

  render() {
    return (
      <div className="WorkoutPlan Card col-xs-12">
        <Tabs defaultActiveKey={1} id='wptabs'>
          <Tab eventKey={1} title="My Custom Plan"><MyPlan/></Tab>
          <Tab eventKey={2} title="My FitMe Plan"><FitMePlan/></Tab>
        </Tabs>
      </div>
    );
  } // end render
}

export default WorkoutPlan;
