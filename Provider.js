import React from "react";
import {compose as componentCompose, branch, renderNothing, renderComponent} from "recompose":
import { Provider as StoreProvider } from "react-redux";
import { decorator as injectSensors } from "react-native-sensors";

const StateProvider = Component => {
    return null
};

const injectSensorProps = injectSensors({ Gyroscope: true });

const SensorProvider = Component =>
      compose(
          branch(
          ({Accelerometer, Gyroscope}) => Accelerometer && Gyroscope,
          renderComponent(Component),
              renderNothing),
          injectSensors
      )(Component);

export default componentCompose(
    SensorProvider,
    StateProvider
);
