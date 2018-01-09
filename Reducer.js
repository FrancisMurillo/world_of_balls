import { combineReducers } from "redux";
import { createAction, handleActions } from "redux-actions";

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

const membersSelector = state => state[membersReducer.key];

export const joinRoom = createAction("SELF/JOIN_ROOM");
export const updatePosition = createAction("SELF/UPDATE_POSITION");

const selfReducer = handleActions(
  {
    [joinRoom]: (state, action) => state,
    [updatePosition]: (state, action) => state
  },
  {
    name: null,
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
export const send = createAction("CHANNEL/SEND", (topic, message, qos = 0, retained = false) => ({
    topic,
    message,
    qos,
    retained
}));
export const receive = createAction("CHANNEL/RECEIVE", ({destinationName, _payloadString, payloadBytes, qos, retained, duplicate}) => ({
    "topic": destinationName,
    "message": msgpack.decode(payloadBytes),
    retained,
    duplicate
}));

export const connected = createAction("CHANNEL/CONNECTED");
export const delivered = createAction("CHANNEL/DELIVERED");
export const disconnected = createAction("CHANNEL/DISCONNECTED");
export const errored = createAction("CHANNEL/ERRORED");

export default combineReducers({
  [membersReducer.key]: membersReducer,
  [selfReducer.key]: selfReducer,
  [sensorReducer.key]: sensorReducer
});
