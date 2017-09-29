import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.publish('users', () => Meteor.users.find());

FiveByFive = new Mongo.Collection('fiveByFive');
Meteor.publish('fiveByFive', () => FiveByFive.find());

PPL = new Mongo.Collection('ppl');
Meteor.publish('ppl', () => PPL.find());

WeightLoss = new Mongo.Collection('weightLoss');
Meteor.publish('weightLoss', () => WeightLoss.find());

if (!FiveByFive.find().count()) {
  const fiveByFiveData = JSON.parse(Assets.getText('fiveByFive.json'));
  fiveByFiveData.days.forEach((item) => {
    FiveByFive.insert(item);
  });
}

if (!PPL.find().count()) {
  const pplData = JSON.parse(Assets.getText('ppl.json'));
  pplData.days.forEach((item) => {
    PPL.insert(item);
  });
}

if (!WeightLoss.find().count()) {
  const weightLossData = JSON.parse(Assets.getText('weightLoss.json'));
  weightLossData.days.forEach((item) => {
    WeightLoss.insert(item);
  });
}
