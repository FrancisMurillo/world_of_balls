import Config from "react-native-config";

const SECOND = 1000;

export default {
    websocketHost: __DEV__ ? "ws://192.168.1.48:54880/mqtt" : Config.WEBSOCKET_HOST,
    connectionOptions: {
        "timeout": 30 * SECOND
    },
    "channelOptions": {
        "timeout": 30 * SECOND
    }
};
