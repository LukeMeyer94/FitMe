import React from 'react';
import { browserHistory } from 'react-router';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

const handleLogout = () => Meteor.logout(() => { Session.clear(); browserHistory.push('/login'); });

const userName = () => {
  const user = Session.get('username');
  const name = user || '';
  return user ? `${name.first} ${name.last}` : '';
};

const AuthenticatedNavigation = () => (
  <div>
    <Nav pullRight>
      <NavDropdown eventKey={ 3 } title={ userName() } id="basic-nav-dropdown">
        <MenuItem eventKey={ 3.1 } href="/dashboard">Dashboard</MenuItem>
        <MenuItem eventKey={ 3.1 } onClick={ handleLogout }>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

export default AuthenticatedNavigation;
