import React from 'react';
import PropTypes from 'prop-types';
import AppNavigation from '../containers/AppNavigation.js';

const App = ({ children }) => (
  <div>
    <AppNavigation />
      { children }
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
