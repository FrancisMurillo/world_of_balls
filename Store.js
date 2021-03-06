import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import thunkMiddleware from 'redux-thunk'

import createSagaMiddleware from "redux-saga";

import reducers from "./Reducer";
import saga from "./Saga";

const composeEnhancers = composeWithDevTools({ shouldHotReload: true });
const sagaMiddleware = createSagaMiddleware();

const middleware = composeEnhancers(
    applyMiddleware(
        thunkMiddleware,
        sagaMiddleware
    ));

const store = createStore(reducers, middleware);

sagaMiddleware.run(saga);

export default store;
