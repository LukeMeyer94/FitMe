import { Tabs, Tab, Glyphicon } from 'react-bootstrap';
import React from 'react';
import Account from './Account.jsx';
import Bio from './Bio.jsx';
import TDEECalc from './TDEECalc.jsx';

const AccountTitle = (<span><Glyphicon glyph="cog" /> Account</span>);
const BioTitle = (<span><Glyphicon glyph="user"/> Bio</span>);
const TDEECalcTitle = (<span>TDEE Calculator</span>);
const UserInfoTabs = (
  <Tabs defaultActiveKey={1} id="uitabs">
    <Tab eventKey={1} title={AccountTitle}><Account /></Tab>
    <Tab eventKey={2} title={BioTitle}><Bio myVal="abcd" /></Tab>
    <Tab eventKey={3} title={TDEECalcTitle}><TDEECalc /></Tab>
  </Tabs>
);

export default UserInfoTabs;
