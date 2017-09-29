import Geosuggest from 'react-geosuggest';
import { Meteor } from 'meteor/meteor';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../../../components/Loading.js';
// import { NewBio } from './NewBio.jsx';

let gymSelected = false;
let gymName = null;

class Bio extends React.Component {

  // onFocus() {
  //   console.log('onFocus');
  // }
  //
  // onBlur(value) {
  //   console.log('onBlur', value);
  // }

  onChange() {
    gymSelected = false;
    // console.log(`input changes to :${value}`);
  }

  onSuggestSelect(suggest) {
    gymSelected = true;
    gymName = suggest.label;
    // gymId = suggest.placeId;
    // console.log(suggest);
  }

  // onSuggestNoResults(userInput) {
  //   console.log(`onSuggestNoResults for :${userInput}`);
  // }

  constructor(props) {
    super(props);

    this.state = {
      newPassword: '',
      retypePassword: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const currentUser = Meteor.user();

    if (gymSelected || currentUser.profile.bio.location) {
      // Check and verify name updates
      const Age = ReactDOM.findDOMNode(this.refs.Age).value;
      const Weight = ReactDOM.findDOMNode(this.refs.Weight).value;
      const heightFt = ReactDOM.findDOMNode(this.refs.heightFt).value;
      const heightIn = ReactDOM.findDOMNode(this.refs.heightIn).value;
      let Location = gymName;
      if (currentUser.profile
        && currentUser.profile.bio
        && (currentUser.profile.bio.location === $('#geosuggest').val())) {
        Location = currentUser.profile.bio.location;
      }
      const goal = ReactDOM.findDOMNode(this.refs.goal).value;

      if (!this.isNumber(Age)
          || !this.isNumber(Weight)
          || !this.isNumber(heightFt)
          || !this.isNumber(heightIn)) {
        Bert.alert('Please populate text fields with numbers', 'warning');
        return;
      }

      Meteor.users.update({ _id: Meteor.userId() }, { $set: {
        'profile.bio.age': Age,
        'profile.bio.weight': Weight,
        'profile.bio.heightFt': heightFt,
        'profile.bio.heightIn': heightIn,
        'profile.bio.location': Location,
        'profile.bio.goal': goal,
      },
      });
      Bert.alert('Bio Successfully Changed!', 'success');
      this.forceUpdate();
    } else {
      Bert.alert('Please select a gym', 'warning');
    }
  }

  isNumber(s) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(s);
  }

  render() {
    const types = ['establishment'];
    const currentUser = Meteor.user();

    if (!Meteor.user()) {
      return (<div className="col-xs-offset-6 animated fadeIn"><Loading/></div>);
    }

    // Element stylings
    const divStyle = {
      color: '#666',
    };

    const buttonStyle = {
      marginTop: '20px',
    };

    const nameInputStyle = {
      width: 'auto',
      display: 'inline',
      marginRight: '10px',
      marginTop: '10px',
    };

    // const arrUnits = ['kgs', 'lbs'];
    const goalTypes = ['Muscle Gain', 'Weight Loss', 'Improve Overall Fitness'];

    let age = '';
    let heightFt = '';
    let heightIn = '';
    let weight = '';
    let location = '';
    let goal = 'Muscle Gain';

    if (currentUser.profile.bio) {
      age = currentUser.profile.bio.age ? currentUser.profile.bio.age : '';
      heightFt = currentUser.profile.bio.heightFt ? currentUser.profile.bio.heightFt : '';
      heightIn = currentUser.profile.bio.heightIn ? currentUser.profile.bio.heightIn : '';
      weight = currentUser.profile.bio.weight ? currentUser.profile.bio.weight : '';
      location = currentUser.profile.bio.location ? currentUser.profile.bio.location : '';
      goal = currentUser.profile.bio.goal ? currentUser.profile.bio.goal : 'Muscle Gain';
    }

    return (
      <div style={divStyle} className='col-sm-12 animated fadeIn'>
        <Form horizontal onSubmit={this.handleSubmit} id="bioform" >
          <FormGroup controlId="formInlineAge">
            <br />
            <ControlLabel>Age: </ControlLabel>
            <FormControl
              ref="Age"
              type="text"
              id="age"
              defaultValue={age}
              style={nameInputStyle} />
          </FormGroup>
          <FormGroup controlId="formInbodySpecs">
            <br />
            <ControlLabel>Weight:</ControlLabel>
            <FormControl
              ref="Weight"
              id="weight"
              type="text"
              defaultValue={weight}
              style={nameInputStyle} />
            <ControlLabel>lbs</ControlLabel>
            {/* <select ref="weightUnit" defaultValue={currentUser.profile.bio.weightUnit} >
              {
              arrUnits.map(units => <option key={units}
                value={units}>{units}</option>)
              }
            </select>*/}
            <br />
            <ControlLabel>Height:</ControlLabel>
            <FormControl
              ref="heightFt"
              id="height_ft"
              type="text"
              defaultValue={heightFt}
              style={nameInputStyle} />
            <ControlLabel>
              ft
            </ControlLabel>
            <FormControl
              ref="heightIn"
              id="height_in"
              type="text"
              defaultValue={heightIn}
              style={nameInputStyle} />
            <ControlLabel>
              in
            </ControlLabel>
            <br />
            <ControlLabel>Preferred Gym Location: </ControlLabel>
            <Geosuggest
              onFocus={ this.onFocus }
              onBlur={ this.onBlur }
              onChange={ this.onChange }
              onSuggestSelect={ this.onSuggestSelect }
              onSuggestNoResults={this.onSuggestNoResults}
              types={types}
              initialValue={location}
              autoActivateFirstSuggest={true}
              id="geosuggest"
            />
          </FormGroup>
          <FormGroup controlId="formInlineGoals">
            <br />
            <ControlLabel>Fitness Goals: </ControlLabel>
            <select ref="goal" defaultValue={goal} >
              {
              goalTypes.map(units => <option key={units}
                value={units}>{units}</option>)
              }
            </select>
          </FormGroup>
          <FormGroup id="formInlineSubmit" >
            <Button type="submit" style={buttonStyle}>Update</Button>
          </FormGroup>
        </Form>
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
    currentUser: Meteor.user(),
  };
}, Bio);
