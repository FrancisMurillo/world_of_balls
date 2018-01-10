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

// prettier-ignore
const Box = styled.View`
  position: absolute;
  backgroundColor: ${(props) => props.color};
  top: ${(props) => (props.containerSize - props.size) * props.x};
  left: ${(props) => (props.containerSize - props.size) * props.y};
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`;

const GameScreen = ({ self, members }) => {
  const { width, height } = Dimensions.get("window");

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
    <Screen style={{ flexDirection: landscape ? "row" : "column" }}>
      <Block style={blockStyle} />
      <World style={{ width: size, height: size }}>
        <Box containerSize={size} {...self} />
        {members.members.map(member => (
          <Box key={member.name} containerSize={size} {...member} />
        ))}
      </World>
      <Block style={blockStyle} />
    </Screen>
  );
};

const injectSensorProps = componentCompose(
  connect(createSelector(state => state["sensor"], sensor => ({ sensor })), {
    onChangeAxis: changeAxis
  }),
  injectSensors({
    Accelerometer: true,
    Gyroscope: true
  }),
  lifecycle({
    componentWillReceiveProps(next) {
      if (next.Gyroscope && next.Accelerometer) {
        if (this.props.sensor.timestamp < next.Gyroscope.timestamp) {
          this.props.onChangeAxis(next.Gyroscope);
        } else {
          requestAnimationFrame(() => {
            this.props.onChangeAxis(this.props.sensor || next.Gyroscope);
          });
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

export default componentCompose(injectSensorProps, connect(selector, null))(
  GameScreen
);
