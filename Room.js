import React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import styled from "styled-components/native";

const Block = styled.View`
  flex: 1;
  background-color: black;
`;

const Screen = styled.View`
  width: 100%;
  height: 100%;
`;

const World = styled.View`
  flex: 2;
  background-color: white;
`;

const GameScreen = () => (
  <Screen>
    <Block />
    <World />
    <Block />
  </Screen>
);

const selector = createSelector(
  [state => state["self"], state => state["members"]],
  (self, members) => ({
    self,
    members
  })
);

export default connect(selector, null)(GameScreen);
