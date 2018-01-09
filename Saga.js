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
import msgpack from "msgpack-lite";

import config from "./Config";
import {
  changeAxis,
  tick,
  updatePosition,
  connect,
  selfSelector,
  connected,
  errored,
  delivered,
  receive,
  send
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
    // yield put(tick());
  }
}

function* animationSaga() {
  yield all([fork(tickFlow)]);
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

function* createConnectionFlow() {
  const self = yield select(selfSelector);

  self.name = "MEOW";
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

      const lastWillMessage = new Message("LEAVE");
      lastWillMessage.destinationName = "room";

      client
        .connect({
          ...config.connectionOptions,
          reconnect: true,
          willMessage: lastWillMessage
        })
        .then(() => {
          return Promise.all([
            client.subscribe("room", config.channelOptions),
            client.subscribe("room/position", config.channelOptions)
          ]);
        })
        .then(() => {
          dispatch(connected());
        })
        .catch(error => {
          dispatch(errored(error));
        });
    });
  }
}

function* sendInitialStateFlow(action) {
  yield put(send("room", "stuff", 1));
}

function* sendMessageFlow(action) {
  if (client) {
    const { topic, message, qos, retained } = action.payload;
    client.send(topic, msgpack.encode(message), qos, retained);
  }
}

function* channelSaga() {
  yield all([
    takeEvery(connect, createConnectionFlow),
    takeEvery(send, sendMessageFlow),
    takeEvery(connected, sendInitialStateFlow)
  ]);

  yield put(connect());
}

export default function* saga() {
  yield all([
    spawn(animationSaga),
    spawn(channelSaga),
    spawn(roomSaga),
    spawn(sensorSaga)
  ]);
}
