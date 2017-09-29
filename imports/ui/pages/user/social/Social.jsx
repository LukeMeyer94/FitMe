import { Meteor } from 'meteor/meteor';
import React from 'react';
import SocialTabs from './SocialTabs.jsx';
import './Social.scss';

class Social extends React.Component {
  render() {
    if (Meteor.userId()) {
      return (
        <div className="Social Card col-xs-12 ">
          {SocialTabs}
        </div>
      );
    }

    return (window.location.href = '/login');
  }
}

export default Social;
