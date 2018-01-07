import Config from "react-native-config";

export default {
  websocketHost: __DEV__ ? "ws://127.0.0.1:58800" : Config.WEBSOCKET_HOST
};
