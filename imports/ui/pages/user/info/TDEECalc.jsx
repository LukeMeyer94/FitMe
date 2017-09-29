import { Meteor } from 'meteor/meteor';
import { Form, FormGroup, FormControl, ControlLabel, Button, Radio } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../../../components/Loading.js';

class TDEECalc extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gender: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
  }
  handleGenderChange(e) {
    this.setState({
      gender: e.target.value,
    });
  }

  handleChange(e) {
    e.preventDefault();
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.isNumber(this.calculateTDEE())) {
      ReactDOM.findDOMNode(this.refs.TDEE).value = Math.round(this.calculateTDEE());
    }
  }

  isNumber(s) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(s);
  }

  calculateTDEE() {
    const weight = +ReactDOM.findDOMNode(this.refs.weight).value;
    const heightIMP = +(ReactDOM.findDOMNode(this.refs.heightFt).value * 12)
      + +ReactDOM.findDOMNode(this.refs.heightIn).value;
    const heightMET = heightIMP * 2.54;
    const age = +ReactDOM.findDOMNode(this.refs.age).value;

    if (!this.isNumber(weight) || !this.isNumber(heightIMP) || !this.isNumber(age)) {
      Bert.alert('Please populate the fields with numbers', 'warning');
      return null;
    }


    let bmr = 0;
    if (this.state.gender === 'male') {
      bmr = (66 + (weight * 6.23) + (heightMET * 5)) - (age * 6.8);
    } else if (this.state.gender === 'female') {
      bmr = (655 + (weight * 4.36) + (heightMET * 1.8)) - (age * 4.7);
    } else {
      Bert.alert('Please select a gender', 'warning');
      return null;
    }

    return bmr * 1.6;
  }

  render() {
    const currentUser = Meteor.user();

    if (!Meteor.user()) {
      return (<div className="col-xs-offset-6 animated fadeIn"><Loading/></div>);
    }

    // Element stylings
    const divStyle = {
      color: '#666',
    };

    const nameInputStyle = {
      width: 'auto',
      display: 'inline',
      marginRight: '10px',
      marginTop: '10px',
    };

    const buttonStyle = {
      marginTop: '20px',
    };

    let age = '';
    let heightFt = '';
    let heightIn = '';
    let weight = '';

    if (currentUser.profile.bio) {
      age = currentUser.profile.bio.age ? currentUser.profile.bio.age : '';
      heightFt = currentUser.profile.bio.heightFt ? currentUser.profile.bio.heightFt : '';
      heightIn = currentUser.profile.bio.heightIn ? currentUser.profile.bio.heightIn : '';
      weight = currentUser.profile.bio.weight ? currentUser.profile.bio.weight : '';
    }

    return (
      <div style={divStyle} className='col-sm-12 animated fadeIn'>
        <Form id="tddform" horizontal onSubmit={this.handleSubmit}>
          <FormGroup controlId="formInlineStats">
            <ControlLabel>Stats</ControlLabel>
            <br />
            <ControlLabel>Height</ControlLabel>
            <br />
            <FormControl ref="heightFt"
              name="heightFt"
              type="text"
              defaultValue={heightFt}
              style={nameInputStyle} />
            <ControlLabel>Ft</ControlLabel>
            {' '}
            <FormControl
              ref="heightIn"
              name="heightIn"
              type="text"
              defaultValue={heightIn}
              style={nameInputStyle} />
            <ControlLabel>in</ControlLabel>
            <br />
            <ControlLabel>Weight</ControlLabel>
            <br />
            <FormControl
              ref="weight"
              name="weight"
              type="text"
              defaultValue={weight}
              style={nameInputStyle} />
            <ControlLabel>lbs</ControlLabel>
            <br />
            <ControlLabel>Age</ControlLabel>
            <br />
            <FormControl
              ref="age"
              name="age"
              type="text"
              defaultValue={age}
              style={nameInputStyle} />
            <ControlLabel>years</ControlLabel>
            <Radio
              name="genderOptions"
              value="male" id="maleSelector"
              onChange={this.handleGenderChange}>
                Male
            </Radio>{' '}
            <Radio
              name="genderOptions"
              value="female" id="femaleSelector"
              onChange={this.handleGenderChange}>
              Female
            </Radio>
          </FormGroup>
          <FormGroup controlId="formInlineEmail">
            <FormControl disabled
              ref="TDEE"
              type="text"
              placeholder="TDEE"
              name="TDEE"
              style={nameInputStyle} />
            Calories per day
          </FormGroup>
          <FormGroup controlId="formInlineSubmit">
            <Button type="submit" style={buttonStyle}>Calculate</Button>
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
    users: Meteor.users,
    currentUser: Meteor.user(),
  };
}, TDEECalc);
