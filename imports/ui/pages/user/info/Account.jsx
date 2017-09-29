import { Meteor } from 'meteor/meteor';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import ReactDOM from 'react-dom';
import Loading from '../../../components/Loading.js';

class Account extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      retypePassword: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getPasswordValidationState() {
    if (this.state.newPassword.length > 0) {
      if (this.state.newPassword.length < 6) return 'warning';
      else if (this.state.newPassword === this.state.retypePassword) return 'success';
      return 'error';
    }
    return 'error';
  }

  handleChange(e) {
    this.setState({
      newPassword: ReactDOM.findDOMNode(this.refs.newPassword).value,
      retypePassword: ReactDOM.findDOMNode(this.refs.retypePassword).value,
    });
    e.preventDefault();
  }

  handleSubmit(e) {
    e.preventDefault();

    // Check and verify name updates
    const firstName = ReactDOM.findDOMNode(this.refs.firstName).value;
    const lastName = ReactDOM.findDOMNode(this.refs.lastName).value;
    const currentUser = Meteor.user();

    if (firstName !== currentUser.profile.name.first ||
        lastName !== currentUser.profile.name.last) {
      if (firstName.length > 0) {
        Meteor.users.update({ _id: Meteor.userId() }, { $set: {
          'profile.name.first': firstName,
          'profile.name.last': lastName,
        },
        });
        Bert.alert('Name Successfully Changed!', 'success');
      } else {
        Bert.alert('First Name should be provided', 'danger');
        return;
      }
    }


    // Check and update password updates
    if (this.getPasswordValidationState() === 'success') {
      const currentPassword = ReactDOM.findDOMNode(this.refs.currentPassword).value;
      Accounts.changePassword(currentPassword, this.state.newPassword, (error) => {
        if (error) {
          Bert.alert(error.reason, 'warning');
        } else {
          Bert.alert('Details Updated!', 'success');
          ReactDOM.findDOMNode(this.refs.currentPassword).value = '';
          ReactDOM.findDOMNode(this.refs.newPassword).value = '';
          ReactDOM.findDOMNode(this.refs.retypePassword).value = '';
        }
      });
    } else if (this.getPasswordValidationState() === 'warning') {
      Bert.alert('New Password Too Short (Min. 6 Characters)', 'danger');
    }
  }

  render() {
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


    const currentUser = Meteor.user();

    return (
      <div style={divStyle} className='col-sm-12 animated fadeIn'>
        <Form horizontal onSubmit={this.handleSubmit} id="accountForm">
          <FormGroup id="formInlineEmail">
            <ControlLabel>Email:</ControlLabel>
            {' '}
            {Meteor.user().emails[0].address}
          </FormGroup>
          <FormGroup id="formInlineName">
            <ControlLabel>Name</ControlLabel>
            <br />
            <FormControl
              ref="firstName"
              id="firstName"
              type="text"
              placeholder="First Name"
              style={nameInputStyle}
              defaultValue={currentUser.profile.name.first} />
            <FormControl
              ref="lastName"
              id="lastName"
              type="text"
              placeholder="Last Name"
              style={nameInputStyle}
              defaultValue={currentUser.profile.name.last}/>
          </FormGroup>
          <FormGroup id="formInlinePassword">
            <ControlLabel>Password</ControlLabel>
            <br />
            <FormControl
              ref='currentPassword'
              id="currentPassword"
              type="password"
              placeholder="Current Password"
              style={nameInputStyle} />
          </FormGroup>
          <FormGroup id="formInlinePassword" validationState={this.getPasswordValidationState()}>
            <FormControl
              ref='newPassword'
              id="newPassword"
              type="password"
              placeholder="New Password"
              style={nameInputStyle}
              onChange={this.handleChange} />
            {' '}
            <FormControl
              ref='retypePassword'
              id="retypePassword"
              type="password"
              placeholder="Re-type Password"
              style={nameInputStyle}
              onChange={this.handleChange} />
          </FormGroup>
          <FormGroup id="formInlineSubmit">
            <Button type="submit" style={buttonStyle}>
              Update
            </Button>
          </FormGroup>
        </Form>
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
}, Account);
