import {applyMiddleware, createStore, Store} from 'redux';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';

//import Routes from "../../server/routers/Routes"
//import AppConstants from 'admin/constants/AppConstants'
import {CombineReducer} from 'admin/reducers/CombineReducer';
//import ExecutionEnvironment from 'exenv';

let middleware;
	middleware = applyMiddleware(logger, reduxThunk);
/*if (process.env.NODE_ENV !== 'production') {
	middleware = applyMiddleware(logger, reduxThunk, routerMiddleware(history));
} else {
	middleware = applyMiddleware(reduxThunk, routerMiddleware(history));
}*/

export const MainStore = createStore<any>(
	CombineReducer,
	middleware,
);
