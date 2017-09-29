import React from 'react';
import Geosuggest from 'react-geosuggest';

export default class GymSelection extends React.Component {
  render() {
    // const fixtures = [
    //   {label: 'Campus Recreation and Wellness Center',
    //    location: {lat: 41.6571383, lng: -91.53858939999998}},
    //   {label: 'Fitness East Recreational Facilty', location:
    //    {lat: 41.6628183, lng: -91.53722849999997}},
    // ];

    const types = ['establishment'];
    // const selectedGymId = null;
    // const selectedGymName = null;

    return (
      <div>
        <Geosuggest
          onFocus={ this.onFocus }
          onBlur={ this.onBlur }
          onChange={ this.onChange }
          onSuggestSelect={ this.onSuggestSelect }
          onSuggestNoResults={this.onSuggestNoResults}
          types={types}
          />
      </div>
    );
  }

  // onFocus() {
  //   console.log('onFocus');
  // }

  // onBlur(value) {
  //   console.log('onBlur', value);
  // }
  //
  // onChange(value) {
  //   console.log(`input changes to :${value}`);
  // }

  // onSuggestSelect(suggest) {
  //   const selectedGymName = suggest.label;
  //   const selectedGymId = suggest.placeId;
  //   console.log(selectedGymId);
  //   console.log(selectedGymName);
  //   console.log(suggest);
  // }

  // onSuggestNoResults(userInput) {
  //   console.log(`onSuggestNoResults for :${userInput}`);
  // }
}
