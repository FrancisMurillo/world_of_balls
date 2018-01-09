import { combineReducers } from "redux";
import { createAction, handleActions } from "redux-actions";
import { reducer as formReducer } from "redux-form";
import { NavigationActions } from "react-navigation";
import { Navigator } from "./Router";

export const changeAxis = createAction("GYROSCOPE/CHANGE_AXIS");

const sensorInitialState = {
  timestamp: 0,
  x: null,
  y: null,
  z: null
};

const sensorReducer = handleActions(
  {
    [changeAxis]: (state, action) => action.payload
  },
  sensorInitialState
);
sensorReducer.key = "sensor";

export const sensorSelector = state => state[sensorReducer.key];

export const addMember = createAction("MEMBER/ADD_MEMBER");
export const updateMemberPosition = createAction("MEMBER/UPDATE_POSITION");
export const removeMember = createAction("MEMBER/REMOVE_MEMBER");

const memberInitialState = {
  name: null,
  length: null,
  width: null,
  x: null,
  y: null
};

const membersReducer = handleActions(
  {
    [addMember]: (state, action) => state,
    [updateMemberPosition]: (state, action) => state,
    [removeMember]: (state, action) => state
  },
  []
);
membersReducer.key = "members";

export const membersSelector = state => state[membersReducer.key];

export const joinRoom = createAction("SELF/JOIN_ROOM");
export const updateProfile = createAction("SELF/UPDATE_PROFILE");
export const updatePosition = createAction("SELF/UPDATE_POSITION");

const selfReducer = handleActions(
  {
    [updateProfile]: (state, action) => ({
      ...state,
      name: action.payload.name,
      color: action.payload.color
    }),
    [joinRoom]: (state, action) => state,
    [updatePosition]: (state, action) => state
  },
  {
    name: null,
    color: null,
    length: null,
    width: null,
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

export const connected = createAction("CHANNEL/CONNECTED");
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
