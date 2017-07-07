import { combineReducers, Action } from 'redux';

import UIReducer from 'admin/reducers/UIReducer';
import {routerReducer} from 'react-router-redux';

export const CombineReducer:any = combineReducers({
	UI: UIReducer,
	router: routerReducer,
});
