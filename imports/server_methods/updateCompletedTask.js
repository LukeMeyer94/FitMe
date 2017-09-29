import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  updateCompletedTask(userId, event, op) {
    check(userId, String);
    check(event, Object);
    check(op, String);

    if (op === 'insert') {
      Meteor.users.update({ _id: userId },
        { $push:
          { completedtasks: { event, date: event.date } } },
      );
      return 'done';
    }

    return 'Did not match operation.';
  },
});
