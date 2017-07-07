import { combineReducers, Action } from 'redux';

//import {UIReducer} from '/reducers/UIReducer'
import {routerReducer} from 'react-router-redux';

export const CombineReducer = combineReducers({
	//UI: UIReducer,
	router: routerReducer,
});
