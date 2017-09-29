import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  updateUserWorkout(userId, event, op) {
    check(event, Object);
    check(userId, String);
    check(op, String);

    if (op === 'insert') {
      Meteor.users.update({ _id: userId }, { $push: { workoutplan: event } });
      return 'done';
    }
    if (op === 'delete') {
      const element = Meteor.users.findOne({ _id: userId }).workoutplan[event.id];
      Meteor.users.update({ _id: userId }, { $pull: { workoutplan: element } });
      return 'done';
    }

    return 'Did not match operation.';
  },
});
