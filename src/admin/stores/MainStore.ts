import {applyMiddleware, createStore, Store} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

//import Routes from "../../server/routers/Routes"
//import AppConstants from 'admin/constants/AppConstants'
import {CombineReducer} from 'admin/reducers/CombineReducer';
//import ExecutionEnvironment from 'exenv';

import promiseMiddleware from 'redux-promise-middleware';

let middleware;
if (process.env.NODE_ENV !== 'production') {
	middleware = applyMiddleware(promiseMiddleware(), createLogger(), thunk);
} else {
	middleware = applyMiddleware(promiseMiddleware(), thunk);
}

const MainStore:Store<any> = createStore<any>(
	CombineReducer,
	middleware,
);
export default MainStore;
