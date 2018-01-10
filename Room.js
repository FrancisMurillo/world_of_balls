import React from "react";
import { connect } from "react-redux";
import { Dimensions } from "react-native";
import { createSelector } from "reselect";
import styled from "styled-components/native";
import { decorator as injectSensors } from "react-native-sensors";
import {
  compose as componentCompose,
  defaultProps,
  withProps,
  lifecycle,
  renderNothing,
  renderComponent,
  withState
} from "recompose";

import { changeAxis } from "./Action";

// prettier-ignore
const Block = styled.View`
  backgroundColor: black;
`;

const Screen = styled.View`
  width: 100%;
  height: 100%;
`;

// prettier-ignore
const World = styled.View`
  backgroundColor: white;
`;

const GameScreen = ({ dimensions }) => {
  const { width, height } = dimensions;

  const landscape = width > height;
  const { size, edge } = landscape
    ? {
        size: height,
        edge: (width - height) / 2
      }
    : {
        size: width,
        edge: (height - width) / 2
      };

  const blockStyle = landscape ? { width: edge } : { height: edge };

  return (
    <Screen>
      <Block style={blockStyle} />
      <World style={{ width: size, height: size }} />
      <Block style={blockStyle} />
    </Screen>
  );
};

const injectSensorProps = componentCompose(
  injectSensors({
    Accelerometer: true,
    Gyroscope: true
  }),
  connect(createSelector(state => state["sensor"], sensor => ({ sensor })), {
    onChangeAxis: changeAxis
  }),
  lifecycle({
    componentWillReceiveProps(next) {
      if (next.Gyroscope && next.Accelerometer) {
        if (this.props.sensor.timestamp < next.Gyroscope.timestamp - 500) {
          // this.props.onChangeAxis(next.Gyroscope);
        }
      }
    }
  })
);

const selector = createSelector(
  [state => state["self"], state => state["members"]],
  (self, members) => ({
    self,
    members
  })
);

export default componentCompose(
  connect(selector, null),
  withProps(_props => ({ dimensions: Dimensions.get("window") })),
  injectSensorProps
)(GameScreen);
