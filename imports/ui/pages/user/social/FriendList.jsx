import { Meteor } from 'meteor/meteor';
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Alert, Button, Modal, Form, FormGroup, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Loading from '../../../components/Loading.js';
import './FriendList.css';

const goalOptions = [
  { value: 'Muscle Gain', label: 'Muscle Gain' },
  { value: 'Weight Loss', label: 'Weight Loss' },
  { value: 'Improve Overall Fitness', label: 'Improve Overall Fitness' },
];
let currentUserId = '';
let location = { $exists: true };
let firstName = { $exists: true };
let lastName = { $exists: true };
let fitGoal = { $exists: true };

class FriendList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
    this.rejectRequest = this.rejectRequest.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
  }

  modalOpen() {
    this.setState({ showModal: true });
  }

  modalClose() {
    this.setState({ showModal: false });
  }

  onChange(value) {
    this.setState({ value });
  }

  renderPendingButton(user) {
    if (user.profile.friendlist[0].status === 'requestSent') {
      return (
        <div>
          <Button
            id={user._id}
            bsStyle="primary"
            className="pending-friend-accept-button"
            onClick={ () => this.acceptRequest(user._id) }
          >
            Accept
          </Button>

          <Button
            id={user._id}
            bsStyle="danger"
            className="pending-friend-reject-button"
            onClick={ () => this.rejectRequest(user._id) }
          >
            Reject
          </Button>
        </div>
      );
    }
    return (
          <Button
            id={user._id}
            bsStyle="default"
            className="pending-friend-cancel-button"
            onClick={ () => this.cancelRequest(user._id) }
          >
            Cancel Request
          </Button>
    );
  }

  acceptRequest(user) {
    Meteor.call('setFriendship', currentUserId, user, 'requestReceived', 'true');
    Meteor.call('setFriendship', user, currentUserId, 'requestSent', 'true');

    Bert.alert('Friend request accepted', 'success');
    $(`#${user}.pending-friend-accept-button`).text('Accepted').prop('disabled', true);
    $(`#${user}.pending-friend-reject-button`).prop('disabled', true);
  }

  rejectRequest(user) {
    Meteor.call('setFriendship', currentUserId, user, 'requestReceived', 'false');
    Meteor.call('setFriendship', user, currentUserId, 'requestSent', 'false');

    Bert.alert('Friend request rejected', 'danger');
    $(`#${user}.pending-friend-accept-button`).prop('disabled', true);
    $(`#${user}.pending-friend-reject-button`).text('Rejected').prop('disabled', true);
  }

  cancelRequest(user) {
    Meteor.call('setFriendship', currentUserId, user, 'requestSent', 'false');
    Meteor.call('setFriendship', user, currentUserId, 'requestReceived', 'false');

    Bert.alert('Friend request cancelled', 'info');
    $(`#${user}.pending-friend-cancel-button`).text('Cancelled').prop('disabled', true);
  }

  removeFriend(user) {
    Meteor.call('setFriendship', currentUserId, user, 'true', 'false');
    Meteor.call('setFriendship', user, currentUserId, 'true', 'false');

    Bert.alert('Friend removed', 'danger');
    $(`#${user}.remove-friend-button`).text('Removed').prop('disabled', true);
  }

  searchSubmit(event) {
    event.preventDefault();

    if ($('#search-first-name').val().length > 0) {
      firstName = $('#search-first-name').val();
    } else { firstName = { $exists: true }; }

    if ($('#search-last-name').val().length > 0) {
      lastName = $('#search-last-name').val();
    } else { lastName = { $exists: true }; }

    if ($("input[name='search-fit-goal']").val() !== undefined) {
      fitGoal = $("input[name='search-fit-goal']").val();
    } else { fitGoal = { $exists: true }; }

    this.modalClose();
  }

  render() {
    const pendingQuery = {
      _id: { $ne: currentUserId },
      'profile.name.first': firstName,
      'profile.name.last': lastName,
      'profile.bio.goal': fitGoal,
      'profile.friendlist': { $elemMatch: { userId: currentUserId, status: { $nin: ['false', 'true'] } } },
    };
    const pendingProjection = {
      'profile.name.first': 1,
      'profile.name.last': 1,
      'profile.bio.goal': 1,
      'profile.friendlist.userId': 1,
      'profile.friendlist.status': 1,
    };
    const friendQuery = {
      _id: { $ne: currentUserId },
      'profile.name.first': firstName,
      'profile.name.last': lastName,
      'profile.bio.goal': fitGoal,
      'profile.friendlist.userId': currentUserId,
      'profile.friendlist.status': 'true',
    };
    const friendProjection = {
      'profile.name.first': 1,
      'profile.name.last': 1,
      'profile.bio.goal': 1,
      'profile.friendlist.userId': 1,
      'profile.friendlist.status': 1,
    };
    const pendingUserSearch = Meteor.users.find(pendingQuery, pendingProjection);
    const friendList = Meteor.users.find(friendQuery, friendProjection);

    if (Meteor.user()) {
      const currentUser = Meteor.user();

      if (!currentUser.profile.bio || !currentUser.profile.bio.location) {
        return (
          <div className="PendingFriends col-xs-12" style={{ height: '110px' }}>
            <h4 style={{ textAlign: 'center', marginTop: '20px' }}>
              Please fill out your bio with gym preference before accessing this feature
              <br/><br/>
              User Info -> Bio tab
            </h4>
          </div>
        );
      }
      currentUserId = currentUser._id;
      location = currentUser.profile.bio.location;
    } else if (!Meteor.user()) {
      return (
        <div className="col-xs-offset-6 animated fadeIn">
          <Loading/>
        </div>
      );
    }

    return (
      <div className="Friends col-xs-12">
        <div id="pending-friends-list" className="col-xs-10
                                                col-sm-10 col-sm-push-1
                                                col-md-10 col-md-push-1
                                                col-lg-10 col-lg-push-1">
          <br/>
          <Button id="advanced-search-btn" onClick={this.modalOpen}>
            Search friends list
          </Button>
          <br/>

          <h3>Pending Friend Requests</h3>
          <br/>

          { pendingUserSearch.count() > 0 ? pendingUserSearch.map(user => (
            <div key={user._id} id="pendingFriend" className="pending-friend-item">
              <img src={user.profile.picture}
                   className="pending-friend-avatar pull-left img-responsive img-circle"
              />
              <div className="pending-friend-description">
                <h4><a href=""> {user.profile.name.first} {user.profile.name.last} </a></h4>
                <span>
                  <p>Replace with some information</p>
                  { this.renderPendingButton(user) }
                </span>
              </div>
            </div>
          ))
            : <Alert>No pending friend requests.</Alert> }
        </div>

        <br/>

        <div id="friends-list" className="col-xs-10
                                                col-sm-10 col-sm-push-1
                                                col-md-10 col-md-push-1
                                                col-lg-10 col-lg-push-1">
          <h3>Friends</h3>

          <br/>

          { friendList.count() > 0 ? friendList.map(user => (
            <div key={user._id} id="friend" className="friend-item">
              <img src={user.profile.picture}
                   className="friend-avatar pull-left img-responsive img-circle"
              />
              <div className="friend-description">
                <h4><a href=""> {user.profile.name.first} {user.profile.name.last} </a></h4>
                <span>
                  <p>Replace with some information</p>
                  <Button
                    id={user._id}
                    bsStyle="danger"
                    className="remove-friend-button"
                    onClick={ () => this.removeFriend(user._id) }
                  >
                    Remove Friend
                  </Button>
                </span>
              </div>
            </div>
          ))
            : <Alert>No users found.</Alert> }
        </div>

        <Modal show={this.state.showModal} onHide={this.modalClose} bsSize="small">
          <Modal.Header closeButton>
            <Modal.Title id="modal-title-lg">Advanced Search</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.searchSubmit} id='searchForm'>
              <h4>First Name</h4>
              <FormGroup>
                <FormControl id="search-first-name" type="text" placeholder="John" />
              </FormGroup>
              <h4>Last Name</h4>
              <FormGroup>
                <FormControl id="search-last-name" type="text" placeholder="Doe" />
              </FormGroup>
              <h4>Fitness Goal</h4>
              <Select
                name="search-fit-goal"
                value={this.state.value}
                options={goalOptions}
                onChange={this.onChange}
                clearable={true}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" form="searchForm">Search</Button>
            <Button onClick={this.modalClose}>Close</Button>
          </Modal.Footer>
        </Modal>
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
}, FriendList);
