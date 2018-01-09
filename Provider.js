import { createSelector } from "reselect";
import React from "react";
import { connect } from "react-redux";
import { Text } from "react-native";
import styled from "styled-components/native";
import { ThemeProvider as BaseThemeProvider } from "styled-components";

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
import { changeAxis, sensorSelector } from "./Reducer";

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
  connect(createSelector(sensorSelector, sensor => ({ sensor })), {
    onChangeAxis: changeAxis
  }),
  lifecycle({
    componentWillReceiveProps(next) {
      if (this.props.sensor.timestamp < next.Gyroscope.timestamp - 200) {
        this.props.onChangeAxis(next.Gyroscope);
      }
    }
  })
)(({ children }) => children);

const theme = {
  primaryColor: "#095697",
  primaryLightColor: "#4c5376",
  primaryDarkColor: "#000022",
  primaryBackgroundColor: "#ffffff",
  backgroundColor: "#cccccc",
  secondaryTextColor: "#39464f",
  secondaryBackgroundColor: "#fafafa",
  textColor: "#9ca2a7",
  primaryTextColor: "#ffffff",
  accentColor: "#33b4d0",
  accentLightColor: "#72e6ff",
  accentDarkColor: "#00849f",
  accentTextColor: "#ffffff",
  secondaryAccentColor: "#fe5722",
  tertiaryAccentColor: "#8dc63f",
  errorTextColor: "#fe5722",
  dividerColor: "#b0b0b0",
  inactiveColor: "#9c9c9c",
  headerTextColor: "#39464f"
};

const ThemeProvider = ({ children }) => (
  <BaseThemeProvider theme={theme}>{children}</BaseThemeProvider>
);

export default ({ children }) => (
  <StateProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </StateProvider>
);
