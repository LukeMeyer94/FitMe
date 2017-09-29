import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { encode } from 'node-base64-image';

Meteor.methods({
  getFbProfilePicture(userId) {
    check(userId, String);

    const currentUser = Meteor.users.findOne({ _id: userId });
    if (currentUser && currentUser.services.facebook) {
      const userFb = currentUser.services.facebook;

      const convertAsyncToSync = Meteor.wrapAsync(HTTP.get);
      const resultOfAsyncToSync = convertAsyncToSync(`https://graph.facebook.com/${userFb.id}/picture`, {
        params: {
          access_token: userFb.accessToken,
          redirect: '0',
          type: 'large',
        } });

      const convertTo64Sync = Meteor.wrapAsync(encode);
      const resultOfConvertTo64Sync = convertTo64Sync(
                                                      resultOfAsyncToSync.data.data.url,
                                                      { string: true },
                                                      );

      Meteor.users.update({ _id: userId }, { $set: { 'profile.picture': `data:image/png;base64,${resultOfConvertTo64Sync}` } });
      return `data:image/png;base64,${resultOfConvertTo64Sync}`;
    }
    return 'default';
  },
});
