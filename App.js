import { toClass } from "recompose";
import React, { Component } from "react";
import {
  StatusBar,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";

import Provider from "./Provider";

const App = () => null;

export default () => (
  <Provider>
    <App />
  </Provider>
);
