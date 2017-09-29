import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

const result = 'noData';
Meteor.methods({
  getFbFriends(userId) {
    check(userId, String);

    const currentUser = Meteor.users.findOne({ _id: userId });
    if (currentUser && currentUser.services.facebook) {
      const userFb = currentUser.services.facebook;
      const convertAsyncToSync = Meteor.wrapAsync(HTTP.get);
      const resultOfAsyncToSync = convertAsyncToSync(`https://graph.facebook.com/${userFb.id}/friends`, {
        params: {
          access_token: userFb.accessToken,
          redirect: '0',
          type: 'large',
        } });
      return (resultOfAsyncToSync.data);
    }
    return result;
  },
});
