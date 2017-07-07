import {applyMiddleware, createStore, Store} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

//import Routes from "../../server/routers/Routes"
//import AppConstants from 'admin/constants/AppConstants'
import {CombineReducer} from 'admin/reducers/CombineReducer';
//import ExecutionEnvironment from 'exenv';

let middleware;
	middleware = applyMiddleware(logger, thunk);
/*if (process.env.NODE_ENV !== 'production') {
	middleware = applyMiddleware(logger, reduxThunk, routerMiddleware(history));
} else {
	middleware = applyMiddleware(reduxThunk, routerMiddleware(history));
}*/

const MainStore:Store<any> = createStore<any>(
	CombineReducer,
	middleware,
);
export default MainStore;
