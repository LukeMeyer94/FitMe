import React from 'react';
import PropTypes from 'prop-types';

class NewBio extends React.Component {

  constructor(props) {
    super(props);
    this.setState({
      a: 'aaa',
      newA: props.newA,
    });
  }

  render() {
    return (
      <div>{this.state.newA}</div>
    );
  }
}

NewBio.propTypes = {
  newA: PropTypes.string,
};

export default NewBio;
