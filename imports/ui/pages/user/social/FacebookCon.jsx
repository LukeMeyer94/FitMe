import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Button, Image } from 'react-bootstrap';
import React from 'react';
// import PropTypes from 'prop-types';
import Loading from '../../../components/Loading.js';

class FacebookCon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicURL: '/images/fbLoadingProfPic.gif',
    };

    this.addService = this.addService.bind(this);
    this.removeService = this.removeService.bind(this);
  }

  addService(e) {
    e.preventDefault();
    Meteor.connectWith('facebook', { requestPermissions: ['email', 'public_profile', 'user_friends', 'publish_actions'] });
  }

  removeService(e) {
    e.preventDefault();
    Meteor.call('unlinkAccountService', Meteor.userId(), 'facebook');
  }

  serviceAdded() {
    const currentUser = Meteor.user();
    const currentUserServices =
      currentUser ?
      currentUser.services : currentUser;
    if (currentUserServices) {
      if ('facebook' in currentUserServices) {
        return true;
      }
      return false;
    }
    return false;
  }

  render() {
    if (!Meteor.user()) {
      return (<div className="center-block animated fadeIn"><Loading/></div>);
    }
    const currentUser = Meteor.user();

    if (this.serviceAdded() === true) {
      const divStyle = {
        marginTop: '60px',
        marginBottom: '40px',
        height: '200px',
        width: 'auto',
        color: '#777',
      };

      Meteor.call('getFbProfilePicture', Meteor.userId(), (error, result) => {
        if (result) {
          if (this.state.profilePicURL !== result) {
            this.setState({ profilePicURL: result });
          }
        }
      });

      return (
        <div id="facebookCon" style={divStyle} className="animated fadeIn">
          <Image className='img-responsive center-block'
            style={{ width: 100, height: 100 }}
            src={this.state.profilePicURL}
            rounded />
          <h5 className='text-center'>
            Facebook User: {currentUser.services.facebook.name}
          </h5>
          <br/>
          <Button
            className='center-block'
            bsStyle="danger"
            bsSize="small"
            onClick={this.removeService}>
            Remove Facebook Link
          </Button>
        </div>
      );
    }

    const divStyle = {
      marginTop: '100px',
      height: '200px',
      width: 'auto',
      color: '#777',
    };
    return (
        <div id="facebookCon" style={divStyle} className="animated fadeIn">
          <h5 className='text-center'>
            Connect your Facebook Account to view  gyms, workout plans etc who also use this app.
          </h5>
          <br/>
          <Button className='center-block' onClick={this.addService}>Link Facebook Account</Button>
        </div>
    );
  }
}


export default createContainer(() => ({
  currentUser: Meteor.user(),
}), FacebookCon);
