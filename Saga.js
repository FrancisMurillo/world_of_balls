import {
  all,
  call,
  fork,
  put,
  select,
  spawn,
  takeEvery
} from "redux-saga/effects";
import { Client, Message } from "react-native-paho-mqtt";

import config from "./Config";
import {
  changeAxis,
  tick,
  updatePosition,
  connect,
  selfSelector
} from "./Reducer";

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

let client = null;

function* createConnectionFlow() {
  const self = yield select(selfSelector);

  self.name = "MEOW";
  if (self && self.name) {
    const { name } = self;

    client = new Client({ uri: config.websocketHost });

    // client.onConnectionLost = onConnectionLost;
    // client.onMessageArrived = onMessageArrived;

    client.connect({
      onSuccess: () => {
        debugger;
      }
    });
  }
}

function* pubSubSaga() {
  yield all([takeEvery(connect, createConnectionFlow)]);

  yield put(connect());
}

export default function* saga() {
  yield all([
    spawn(animationSaga),
    spawn(pubSubSaga),
    spawn(roomSaga),
    spawn(sensorSaga)
  ]);
}
