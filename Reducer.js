import { combineReducers } from "redux";
import { createAction, handleActions } from "redux-actions";

export const changeAxis = createAction("GYROSCOPE/CHANGE_AXIS");

const sensorReducer = handleActions(
  {
    [changeAxis]: (state, action) => action.payload
  },
  {}
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

export default combineReducers({
  [membersReducer.key]: membersReducer,
  [selfReducer.key]: selfReducer,
  [sensorReducer.key]: sensorReducer
});
