import { Bert } from 'meteor/themeteorchef:bert';
import { Mongo } from 'meteor/mongo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './routes.js';

Bert.defaults.style = 'growl-top-right';

FiveByFive = new Mongo.Collection('fiveByFive');
PPL = new Mongo.Collection('ppl');
WeightLoss = new Mongo.Collection('weightLoss');
