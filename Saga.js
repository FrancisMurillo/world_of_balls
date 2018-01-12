import {
  all,
  call,
  fork,
  put,
  select,
  spawn,
  takeEvery
} from "redux-saga/effects";
import { throttle } from "redux-saga";
import { NavigationActions } from "react-navigation";
import { Dimensions, ToastAndroid } from "react-native";
import { Client, Message } from "react-native-paho-mqtt";
import msgpack from "msgpack-lite";

import config from "./Config";
import {
  tick,
  updatePosition,
  connect,
  selfSelector,
  delivered,
  receive,
  send,
  disconnected
} from "./Reducer";
import {
  connected,
  changeAxis,
  updateMembers,
  addMember,
  removeMember,
  updateMemberPosition,
  errored
} from "./Action";

const showAlert = message => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};

function* roomSaga() {
  yield all([]);
}

function* updatePositionFlow(action) {
  const self = yield select(selfSelector);

  const { width, height } = Dimensions.get("window");
  const size = width > height ? height : width;

  const { x: alpha, y: beta, z: gamma } = action.payload;

  const deltaX = -beta;
  const deltaY = gamma;

  const positionX = size * self.x + deltaX * 50;
  const positionY = size * self.y + deltaY * 50;

  yield put(
    updatePosition({
      name: self.name,
      x: Math.max(0, Math.min(size, positionX)) / size,
      y: Math.max(0, Math.min(size, positionY)) / size
    })
  );
}

function* updateServerFlow(action) {
  const { name, x, y } = action.payload;
  yield put(send("room/position", { name, x, y }, 0));
}

function* sensorSaga() {
  yield all([
    takeEvery(changeAxis, updatePositionFlow),
    throttle(300, updatePosition, updateServerFlow)
  ]);
}

const requestFrame = () => new Promise(res => requestAnimationFrame(res));

function* tickFlow() {
  while (true) {
    yield call(requestFrame);
    // yield put(tick());
  }
}

function* animationSaga() {
  // yield all([fork(tickFlow)]);
}

let client = null;

const myStorage = {};
const memoryStorage = {
  setItem: (key, item) => {
    myStorage[key] = item;
  },
  getItem: key => myStorage[key],
  removeItem: key => {
    delete myStorage[key];
  }
};

function* createConnectionFlow(_action) {
  const self = yield select(selfSelector);

  if (self && self.name) {
    const { name } = self;

    yield put(dispatch => {
      client = new Client({
        uri: config.websocketHost,
        storage: memoryStorage,
        clientId: self.name
      });

      client.on("connectionLost", responseObject => {
        dispatch(disconnected(responseObject));
      });

      const parsePayload = payload =>
        typeof payload === "string" ? payload : msgpack.decode(payload);

      client.on("messageDelivered", message => {
        dispatch(
          delivered({
            topic: message.destinationName,
            message: parsePayload(message._payload),
            qos: message.qos,
            retained: message.retained,
            duplicate: message.duplicate
          })
        );
      });

      client.on("messageReceived", message => {
        dispatch(
          receive({
            topic: message.destinationName,
            message: parsePayload(message._payload),
            qos: message.qos,
            retained: message.retained,
            duplicate: message.duplicate
          })
        );
      });

      const lastWillMessage = new Message(self.name);
      lastWillMessage.destinationName = "room/leave";

      client
        .connect({
          ...config.connectionOptions,
          reconnect: false,
          willMessage: lastWillMessage
        })
        .then(() => {
          return Promise.all([
            client.subscribe("room", config.channelOptions),
            client.subscribe("room/position", config.channelOptions),
            client.subscribe("room/members", config.channelOptions),
            client.subscribe("room/leave", config.channelOptions)
          ]);
        })
        .then(() => {
          showAlert("You are now connected to the server");
          dispatch(connected());
        })
        .catch(error => {
          dispatch(errored(error));
        });
    });
  }
}

function* sendInitialStateFlow(action) {
  const self = yield select(selfSelector);

  const { name, color, size, x, y } = self;
  yield put(send("room", { name, color, size, x, y }, 1));
}

function* sendMessageFlow(action) {
  const self = yield select(selfSelector);

  if (client && self.connected) {
    const { topic, message, qos, retained } = action.payload;
    client.send(topic, msgpack.encode(message), qos, retained);
  }
}

function* receiveSwitchFlow(action) {
  const { topic, message } = action.payload;

  switch (topic) {
    case "room":
      yield put(addMember(message));
      break;
    case "room/position":
      yield put(updateMemberPosition(message));
      break;
    case "room/members":
      yield put(updateMembers(message));
      break;
    case "room/leave":
      yield put(removeMember(message));
      break;
    default:
    // NOOP
  }
}

function* revertStateFlow(_action) {
  yield put(
    NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "Login",
          params: {}
        })
      ]
    })
  );

  showAlert("You been disconnected");
}

function* channelSaga() {
  yield all([
    takeEvery(connect, createConnectionFlow),
    takeEvery(send, sendMessageFlow),
    takeEvery(connected, sendInitialStateFlow),
    takeEvery(disconnected, revertStateFlow),
    takeEvery(errored, revertStateFlow),
    takeEvery(receive, receiveSwitchFlow)
  ]);
}

export default function* saga() {
  yield all([
    spawn(animationSaga),
    spawn(channelSaga),
    spawn(roomSaga),
    spawn(sensorSaga)
  ]);
}
