import React from "react";
import { connect } from "react-redux";
import { Text } from "react-native";
import {
  compose as componentCompose,
  branch,
  defaultProps,
  lifecycle,
  renderNothing,
  renderComponent,
  withState
} from "recompose";
import { Provider as StoreProvider } from "react-redux";
import { decorator as injectSensors } from "react-native-sensors";

import store from "./Store";
import { changeAxis, gyroscopeSelector } from "./Reducer";

const StateProvider = defaultProps({ store })(StoreProvider);

const SensorProvider = componentCompose(
  injectSensors({
    Accelerometer: true,
    Gyroscope: true
  }),
  branch(
    ({ Accelerometer, Gyroscope }) => !Accelerometer || !Gyroscope,
    renderNothing
  ),
  connect(null, { onChangeAxis: changeAxis }),
  lifecycle({
    componentWillReceiveProps(next) {
      if (this.props.Gyroscope.timestamp < next.Gyroscope.timestamp - 200) {
        this.props.onChangeAxis(next.Gyroscope);
      }
    }
  })
)(({ children }) => children);

export default ({ children }) => (
  <StateProvider>
    <SensorProvider>{children}</SensorProvider>
  </StateProvider>
);
