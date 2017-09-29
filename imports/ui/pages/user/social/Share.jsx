import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import Loading from '../../../components/Loading.js';

class Share extends React.Component {

  constructor(props) {
    super(props);
    this.sharePost = this.sharePost.bind(this);
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

  sharePost() {
    const message = $('#fbShareMessage').val();
    Meteor.call('postToFb', Meteor.userId(), message, () => {
      Bert.alert('Successfully posted to Faceboook', 'success');
    });
  }

  render() {
    if (!Meteor.user()) {
      return (<div className="col-xs-offset-6 animated fadeIn"><Loading/></div>);
    }
    const currentUser = Meteor.user();
    if (this.serviceAdded() === true) {
      // Element stylings
      const divStyle = {
        color: '#666',
      };

      const formStyle = {
        marginTop: '20px',
      };

      const gym = currentUser.profile.bio.location.split(',')[0];
      const body = `I'm working out today at ${gym}, join me and others on FitMe!`;

      return (
        <div id="shareToFb" style={divStyle} className='col-sm-12 animated fadeIn'>
          <h3>Share to Facebook</h3>
          <Form id='shareToFbForm'>
            <FormControl style={formStyle} id="fbShareMessage" type="text" defaultValue={body} />
            <br />
            <Button bsStyle='success' onClick={this.sharePost}>
              Share to Facebook
            </Button>
          </Form>
          {/* <br />
          <Button
            style={buttonStyle}
            id="sharePostButton"
            onClick={this.sharePost}>
            Share to Facebook
          </Button>*/}
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
        <div id="shareToFb" style={divStyle} className="animated fadeIn">
          <h5 className='text-center'>
            Connect your Facebook Account to share with friends.
          </h5>
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
}, Share);
