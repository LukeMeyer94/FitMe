import { Meteor } from 'meteor/meteor';
import React from 'react';
import './UserInfo.scss';
import UserInfoTabs from './UserInfoTabs.jsx';

class UserInfo extends React.Component {
  render() {
    if (Meteor.userId()) {
      return (
        <div className="UserInfo Card col-xs-12 ">
          {UserInfoTabs}
        </div>
      );
    }

    return (window.location.href = '/login');
  }
}

export default UserInfo;
