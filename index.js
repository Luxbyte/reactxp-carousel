'use strict';

var { createStackNavigator } = require('./dist/navigators/createStackNavigator');
var { createDrawerNavigator } = require('./dist/navigators/createDrawerNavigator');
var { createBrowserApp } = require('@react-navigation/web');
var { withNavigationFocus } = require('@react-navigation/core');
var DrawerItems = require('./dist/views/DrawerItems');
var RX = require('reactxp');

module.exports = {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer: createBrowserApp,
  DrawerItems,
  SafeAreaView: RX.View,
  withNavigationFocus
};
