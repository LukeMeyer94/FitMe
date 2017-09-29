import { Tabs, Tab, Glyphicon } from 'react-bootstrap';
import React from 'react';
import FriendSearch from './FriendSearch.jsx';
import Share from './Share.jsx';
import FacebookCon from './FacebookCon.jsx';
import FriendList from './FriendList.jsx';

const FriendSearchTitle = (<span><Glyphicon glyph="search" /> Friend Search</span>);
const ShareTitle = (<span><Glyphicon glyph="share" /> Share</span>);
const FbConnectTitle = (<span><Glyphicon glyph='thumbs-up'/> Fb Connect</span>);
const FriendListTitle = (<span><i className="fa fa-users" aria-hidden="true"/> Friend List</span>);

const SocialTabs = (
  <Tabs defaultActiveKey={1} id="uitabs">
    <Tab eventKey={1} title={FriendSearchTitle}><FriendSearch /></Tab>
    <Tab eventKey={2} title={FbConnectTitle}><FacebookCon /></Tab>
    <Tab eventKey={3} title={ShareTitle}><Share /></Tab>
    <Tab eventKey={4} title={FriendListTitle}><FriendList /></Tab>
  </Tabs>
);

export default SocialTabs;
