import { createAction } from "redux-actions";

export const changeAxis = createAction("GYROSCOPE/CHANGE_AXIS");

export const addMember = createAction("MEMBER/ADD_MEMBER");
export const removeMember = createAction("MEMBER/REMOVE_MEMBER");
export const updateMembers = createAction("MEMBER/UPDATE_MEMBERS");
export const updateMemberPosition = createAction("MEMBER/UPDATE_POSITION");

export const joinRoom = createAction("SELF/JOIN_ROOM");
