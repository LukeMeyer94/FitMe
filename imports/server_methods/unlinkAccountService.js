import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import defaultProfilePic from '../ui/layouts/defaultProfilePic.jsx';

Meteor.methods({
  unlinkAccountService(userId, serviceName) {
    check(userId, String);
    check(serviceName, String);
    const services = {};
    services[`services.${serviceName}`] = '';

    Meteor.users.update({ _id: userId }, { $unset: services });
    Meteor.users.update({ _id: userId }, { $set: { 'profile.picture': defaultProfilePic } });

    return 'done';
  },
});
