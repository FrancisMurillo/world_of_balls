import { all, call, fork, put, spawn, takeEvery } from "redux-saga/effects";

import { changeAxis, tick, updatePosition } from "./Reducer";

function* roomSaga() {
  yield all([]);
}

function* updatePositionFlow(action) {
  yield put(updatePosition(action.payload));
}

function* sensorSaga() {
  yield all([takeEvery(changeAxis, updatePositionFlow)]);
}

const requestFrame = () => new Promise(res => requestAnimationFrame(res));

function* tickFlow() {
  while (true) {
    yield call(requestFrame);
    yield put(tick());
  }
}

function* animationSaga() {
  yield all([fork(tickFlow)]);
}

export default function* saga() {
  yield all([spawn(animationSaga), spawn(roomSaga), spawn(sensorSaga)]);
}
