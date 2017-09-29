import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import '../imports/startup/server';

Meteor.users.allow({
  insert() { return true; },
  update() { return true; },
});

Meteor.methods({
  setFriendship(currentUser, user, currentStatus, newStatus) {
    check(currentUser, String);
    check(user, String);
    check(currentStatus, Match.Any);
    check(newStatus, String);

    Meteor.users.update(
      { _id: currentUser,
        'profile.friendlist': { $elemMatch: { userId: user, status: currentStatus } },
      },
      { $set:
        { 'profile.friendlist.$.status': newStatus },
      },
    );
  },
});
