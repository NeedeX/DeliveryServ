import React from 'react';
import { Provider } from 'react-redux';

import { createStore } from 'redux';

import allReducers from './src/reducers';
import AppNavigator from './src/AppNavigator';

//import { YellowBox } from 'react-native';
/*
YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
]);
console.disableYellowBox = true;
*/


const store = createStore(allReducers);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={ store } >
        <AppNavigator />
      </Provider>
    );
  }
}