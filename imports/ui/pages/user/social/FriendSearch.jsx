import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import { Alert, Button, Modal, Form, FormGroup, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Loading from '../../../components/Loading.js';
import './FriendSearch.css';


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
let fbFriends = [];
const fetchedFbFriends = false;
let fbFriendProfiles = [];

class FriendSearch extends React.Component {
  constructor(props) {
    super(props);
    fbFriends = [];
    fbFriendProfiles = [];
    this.state = { showModal: false, userShowModal: false, fetchedFbFriends: false };
    this.modalOpen = this.modalOpen.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.userModalOpen = this.userModalOpen.bind(this);
    this.userModalClose = this.userModalClose.bind(this);
    this.userModalOnEnter = this.userModalOnEnter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.update = this.update.bind(this);
    this.getFbFriends = this.getFbFriends.bind(this);
  }

  getFbFriends() {
    Meteor.call('getFbFriends', Meteor.userId(), (error, res) => {
      if (error) {
        Bert.alert('Something went wrong retrieving friends from facebook');
      }
      fbFriends = res.data;
      this.fetchedFbFriends = true;
      this.update();
    });
  }

  update() {
    this.forceUpdate();
  }

  modalOpen() {
    const state = this.state;
    state.showModal = true;
    this.setState(state);
  }

  modalClose() {
    const state = this.state;
    state.showModal = false;
    this.setState(state);
  }

  userModalOpen(userID) {
    this.userModalId = userID;
    const state = this.state;
    state.userShowModal = true;
    this.setState(state);
  }

  userModalClose() {
    const state = this.state;
    state.userShowModal = false;
    this.setState(state);
  }

  userModalOnEnter() {
    const user = Meteor.users.findOne({ _id: this.userModalId });
    const userName = `${user.profile.name.first} ${user.profile.name.last}`;
    const gymLocation = user.profile.bio.location;
    const workoutGoal = user.profile.bio.goal;
    let tasksDone = 0;
    if (user.completedtasks) {
      tasksDone = user.completedtasks.length;
    }

    $('#user-name').html(userName);
    $('#user-workout-goal').html(workoutGoal);
    $('#user-gym-location').html(gymLocation);
    $('#user-tasks-completed').html(tasksDone);
  }

  onChange(value) {
    this.setState({ value });
  }

  addFriend(user) {
    const checkExists = Meteor.users.find({ _id: currentUserId,
      'profile.friendlist': { $elemMatch: { userId: user } },
    }).fetch();

    if (checkExists.length === 0) {
      Meteor.users.update(
        { _id: Meteor.userId() },
        { $addToSet:
          { 'profile.friendlist': { userId: user, status: 'requestSent' } },
        });
      Meteor.users.update(
        { _id: user },
        { $addToSet:
          { 'profile.friendlist': { userId: Meteor.userId(), status: 'requestReceived' } },
        });
    } else {
      Meteor.call('setFriendship', currentUserId, user, { $exists: true }, 'requestSent');
      Meteor.call('setFriendship', user, currentUserId, { $exists: true }, 'requestReceived');
    }

    Bert.alert('Friend request sent!', 'success');
    $(`#${user}`).text('Request Sent').prop('disabled', true);
    $(`#${user + "fb"}`).text('Request Sent').prop('disabled', true);
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
    const query = { $or: [
      {
        _id: { $ne: currentUserId },
        'profile.name.first': firstName,
        'profile.name.last': lastName,
        'profile.bio.location': location,
        'profile.bio.goal': fitGoal,
        'profile.friendlist.userId': { $nin: [currentUserId, null] },
      },
      {
        _id: { $ne: currentUserId },
        'profile.name.first': firstName,
        'profile.name.last': lastName,
        'profile.bio.location': location,
        'profile.bio.goal': fitGoal,
        'profile.friendlist': { $elemMatch: { userId: currentUserId, status: 'false' } },
      },
      {
        _id: { $ne: currentUserId },
        'profile.name.first': firstName,
        'profile.name.last': lastName,
        'profile.bio.location': location,
        'profile.bio.goal': fitGoal,
        'profile.friendlist': null,
      },
    ] };

    const projection = {
      'profile.name.first': 1,
      'profile.name.last': 1,
      'profile.bio.location': 1,
      'profile.bio.goal': 1,
      'profile.friendlist.userId': 1,
      'profile.friendlist.status': 1,
    };

    const userSearch = Meteor.users.find(query, projection);

    if (Meteor.user()) {
      const currentUser = Meteor.user();


      if (!currentUser.profile.bio || !currentUser.profile.bio.location) {
        return (
          <div className="FriendSearch col-xs-12" style={{ height: '110px' }}>
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
    } else if (!Meteor.user() || Object.keys(Meteor.user().length < 1)) {
      return (
        <div className="col-xs-offset-6 animated fadeIn">
          <Loading/>
        </div>
      );
    }

    if (Meteor.user() && Meteor.user().services && Meteor.user().services.facebook && ($('#facebookFriend').length === 0 && !this.fetchedFbFriends)) {
      this.getFbFriends();
    }

    if (!fbFriendProfiles.length) {
      fbFriends.forEach((user) => {
        const fbQuery = { $or: [
          {
            'services.facebook.id': user.id,
            'profile.friendlist.userId': { $nin: [currentUserId, null] },
          },
          {
            'services.facebook.id': user.id,
            'profile.friendlist': { $elemMatch: { userId: currentUserId, status: 'false' } },
          },
          {
            'services.facebook.id': user.id,
            'profile.friendlist': null,
          },
          ]
        };
        const friend = Meteor.users.findOne(fbQuery, projection);
        if(friend){
          fbFriendProfiles.push(friend);
        }
      });
    }

    if ($('#gymFriend > div').length !== userSearch.fetch().length) {
      this.update();
    }

    return (
      <div className="FriendSearch col-xs-12">
        <div id="friend-search-list" className="col-xs-10
                                                col-sm-10 col-sm-push-1
                                                col-md-10 col-md-push-1
                                                col-lg-10 col-lg-push-1">
          <h3>People at your gym</h3>

          <Button id="advanced-search-btn" onClick={this.modalOpen}>
            Advanced search
          </Button>
          <br/>
          <br/>

          { userSearch.count() > 0 ? userSearch.map(user => (
            <div key={user._id} id="gymFriend" className="friend-search-item">
              <img src={user.profile.picture}
                   className="friend-search-avatar pull-left img-responsive img-circle"
              />
              <div className="friend-search-description">
                <h4>
                  <a onClick={this.userModalOpen.bind(this, user._id)}>
                    {user.profile.name.first} {user.profile.name.last}
                  </a>
                </h4>
                <span>
                <p>Replace with some information</p>
                  <Button
                    id={user._id}
                    bsStyle="primary"
                    className="friend-search-button"
                    onClick={ () => this.addFriend(user._id) }
                  >
                    Add Friend
                  </Button>
              </span>
              </div>
            </div>
          ))
            : <Alert>No users found.</Alert> }
        </div>
        <br/>
        <div id="facebook-friend-list" className="col-xs-10
                                                col-sm-10 col-sm-push-1
                                                col-md-10 col-md-push-1
                                                col-lg-10 col-lg-push-1">
          <h3>Facebook Friends</h3>
          <br/><br/>

          { fbFriendProfiles.length > 0 ? fbFriendProfiles.map(user => (
            <div key={user._id} id="facebookFriend" className="friend-search-item">
              <img src={user.profile.picture}
                   className="friend-search-avatar pull-left img-responsive img-circle"
              />
              <div className="friend-search-description">
                <h4><a onClick={this.userModalOpen.bind(this, user._id)}>
                  {user.profile.name.first} {user.profile.name.last}
                </a></h4>
                <span>
                <p>Replace with some information</p>
                <Button
                  id={user._id + "fb"}
                  bsStyle="primary"
                  className="friend-search-button"
                  onClick={ () => this.addFriend(user._id) }
                >
                    Add Friend
                  </Button>
              </span>
              </div>
            </div>
          ))
            : <Alert>No users found.
              If you've connected to Facebook,
              invite some friends now!</Alert> }
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

        <Modal
          show={this.state.userShowModal}
          onHide={this.userModalClose}
          onEnter={this.userModalOnEnter}>
          <Modal.Header closeButton>
            <Modal.Title>User Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <b>Name: </b><span id='user-name'></span>
              <br/><br/>
              <b>Workout Goal: </b> <span id='user-workout-goal'></span>
              <br/><br/>
              <b>Gym Location: </b> <span id='user-gym-location'></span>
              <br/><br/>
              <b>Total Tasks Completed: </b> <span id='user-tasks-completed'></span>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.userModalClose}>Close</Button>
            </Modal.Footer>
        </Modal>
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
}, FriendSearch);
