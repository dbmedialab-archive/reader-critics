import { Action, combineReducers } from 'redux';
import {TypedRecord,makeTypedFactory} from 'typed-immutable-record';

//import {UIReducer} from '/reducers/UIReducer'
import {routerReducer} from 'react-router-redux';

export const CombineReducer = combineReducers({
	//UI: UIReducer,
	router: routerReducer,
});
