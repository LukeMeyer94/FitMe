import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { FB } from 'fb';

Meteor.methods({
  postToFb(userId, message) {
    check(userId, String);
    check(message, String);
    const currentUser = Meteor.users.findOne({ _id: userId });
    if (currentUser && currentUser.services.facebook) {
      const userFb = currentUser.services.facebook;
      FB.setAccessToken(userFb.accessToken);
      // Meteor.absoluteUrl() should give us url.
      FB.api('me/feed', 'post', { message, link: 'https://team5.herokuapp.com/' }, (res) => {
        if (!res || res.error) {
          // console.log(!res ? 'error occurred' : res.error);

        }
        // console.log(`Post Id: ${res.id}`);
      });
    }
    return 'default';
  },
});
