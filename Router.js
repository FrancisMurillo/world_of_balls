import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StackNavigator,
  addNavigationHelpers,
  NavigationActions
} from "react-navigation";

import LoginScreen from "./Login";
import RoomScreen from "./Room";

export const Navigator = StackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    },
    Room: {
      screen: RoomScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "Login"
  }
);

class Routing extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { dispatch, ...state } = this.props;

    return (
      <Navigator
        navigation={addNavigationHelpers({
          dispatch,
          state
        })}
      />
    );
  }
}

export default connect(state => state["nav"], null)(Routing); // HARD Code due to cyclical dependency
