import { toClass } from "recompose";
import React, { Component } from "react";
import { StatusBar, Platform, StyleSheet, Text, View } from "react-native";

import Provider from "./Provider";
import App from "./Router";

export default () => (
  <Provider>
    <App />
  </Provider>
);
