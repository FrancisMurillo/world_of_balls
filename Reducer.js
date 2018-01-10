import { combineReducers } from "redux";
import { createAction, handleActions } from "redux-actions";
import { reducer as formReducer } from "redux-form";
import { NavigationActions } from "react-navigation";
import { Navigator } from "./Router";

const sensorInitialState = {
  timestamp: 0,
  x: null,
  y: null,
  z: null
};

import {
  changeAxis,
  joinRoom,
  updateMembers,
  updateMemberPosition,
  addMember,
  removeMember,
  connected
} from "./Action";

const sensorReducer = handleActions(
  {
    [changeAxis]: (state, action) => action.payload
  },
  sensorInitialState
);
sensorReducer.key = "sensor";

export const sensorSelector = state => state[sensorReducer.key];

const memberInitialState = {
  name: null,
  size: null,
  color: null,
  x: null,
  y: null
};

const membersReducer = handleActions(
  {
    [joinRoom]: (state, action) => ({
      ...state,
      currentName: action.payload.name
    }),
    [addMember]: (state, action) => ({
      ...state,
      members: state.members
        .filter(({ name }) => name !== action.payload.name)
        .concat(action.payload)
        .filter(({ name }) => name !== state.currentName)
    }),
    [updateMemberPosition]: (state, action) => state,
    [removeMember]: (state, action) => ({
      ...state,
      members: members.filter(({ name }) => name !== action.payload)
    }),
    [updateMemberPosition]: (state, action) => ({
      ...state,
      members: state.members.map(member => {
        if (member.name === action.payload.name) {
          return {
            ...member,
            x: action.payload.x,
            y: action.payload.y
          };
        } else {
          return member;
        }
      })
    }),
    [updateMembers]: (state, action) => ({
      ...state,
      members: action.payload.filter(({ name }) => name !== state.currentName)
    })
  },
  {
    currentName: null,
    members: []
  }
);
membersReducer.key = "members";

export const membersSelector = state => state[membersReducer.key];

export const updatePosition = createAction("SELF/UPDATE_POSITION");

const selfReducer = handleActions(
  {
    [joinRoom]: (state, action) => ({
      ...state,
      x: 0.5,
      y: 0.5,
      name: action.payload.name,
      color: action.payload.color,
      size: action.payload.size
    }),
    [connected]: (state, _action) => ({
      ...state,
      connected: true
    }),
    [updatePosition]: (state, action) => ({
      ...state,
      x: action.payload.x,
      y: action.payload.y
    })
  },
  {
    name: null,
    color: null,
    size: null,
    connected: false,
    x: null,
    y: null
  }
);
selfReducer.key = "self";

export const selfSelector = state => state[selfReducer.key];

export const tick = createAction("ANIMATION/TICK");

export const connect = createAction("CHANNEL/CONNECT");
export const disconnect = createAction("CHANNEL/DISCONNECT");
export const send = createAction(
  "CHANNEL/SEND",
  (topic, message, qos = 0, retained = false) => ({
    topic,
    message,
    qos,
    retained
  })
);
export const receive = createAction(
  "CHANNEL/RECEIVE",
  ({ topic, message, retained, duplicate }) => ({
    topic,
    message,
    retained,
    duplicate
  })
);

export const delivered = createAction("CHANNEL/DELIVERED");
export const disconnected = createAction("CHANNEL/DISCONNECTED");
export const errored = createAction("CHANNEL/ERRORED");

formReducer.key = "form";

const navInitialAction = NavigationActions.navigate({ routeName: "Login" }); // HARD CODED value here
const navInitialState = Navigator.router.getStateForAction(navInitialAction);

const navReducer = (state = navInitialState, action) =>
  Navigator.router.getStateForAction(action, state) || state;
navReducer.key = "nav";

const navSelector = state => state[navReducer.key];

export default combineReducers({
  [formReducer.key]: formReducer,
  [membersReducer.key]: membersReducer,
  [navReducer.key]: navReducer,
  [selfReducer.key]: selfReducer,
  [sensorReducer.key]: sensorReducer
});
