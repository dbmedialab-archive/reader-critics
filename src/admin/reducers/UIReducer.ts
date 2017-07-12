import * as Immutable from 'seamless-immutable';

import * as  UIActionsCreator  from 'admin/actions/UIActionsCreator';
import UIType from 'admin/types/UIType';
import AdminConstants from 'admin/constants/AdminConstants';

const initialState = Immutable.from<UIType>({
	modalWindows: {},
	topbar: {
		submenu: {
			isOpen: false,
		},
		accountMenu: {
			isOpen: false,
		},
	},
	mainPreloader: {
		isVisible: false,
		color: '#84B916',
		countOfPreloaders: 0,
	},
	progressBar: {},
});

const initModalParams = {
	isOpen: false,
	isEdit: false,
	input: {},
	checkboxes: {},
};

function modalInit(action, state) {
	const initWindows = {};
	if (Array.isArray(action.payload.windowNames)){
		action.payload.windowNames.map(function(windowName){
			if (!state.getIn(['modalWindows', windowName])) {
				initWindows[windowName] = initModalParams;
			}
		});
	} else {
		initWindows[action.payload.windowNames] = initModalParams;
	}
	return state.merge({modalWindows: initWindows}, {deep: true});
}

function resetFormInput(action, state) {
	if (!state.getIn(['modalWindows', action.payload.windowName])) {
		throw new Error(`You have to init your modal ${action.payload.windowName} window`);
	} else {
		return state.setIn(['modalWindows', action.payload.windowName], initModalParams);
	}
}

function modalStateChanged(action, state) {
	if (!state.getIn(['modalWindows', action.payload.windowName])) {
		throw new Error(`You have to init your modal ${action.payload.windowName} window`);
	} else {
		const mergeObj = {};
		mergeObj[action.payload.windowName] = action.payload.options;
		return state.merge({modalWindows: mergeObj}, {deep: true});
	}
}

function mainPreloaderStateChanged(action, state) {
	interface preloaderOptios {
		isVisible?: boolean;
		countOfPreloaders?: number;
		color?: string;
	}
	console.log(action);
	let mainPreloader = state.getIn(['mainPreloader']),
				countOfPreloaders = mainPreloader.getIn(['mainPreloader','countOfPreloaders']);
	const options : preloaderOptios = {};
	options.isVisible = action.payload.isVisible;
	if (options.isVisible) {
		countOfPreloaders++;
	} else {
		countOfPreloaders--;
		if (countOfPreloaders > 0) options.isVisible = true;
	}
	options.countOfPreloaders = countOfPreloaders;
	console.log(initialState);
	action.payload.color && (options.color = action.payload.color);
	return state.merge({'mainPreloader': options}, {deep: true});
}

function UIReducer(state: UIType = initialState, action: UIActionsCreator.TAction): UIType {
	switch (action.type) {
		case AdminConstants.MODAL_INIT:
			return modalInit(action, state);
		case AdminConstants.MODAL_STATE_CHANGED:
			return modalStateChanged(action, state);
		case AdminConstants.RESET_FORM_INPUT:
			return resetFormInput(action, state);
		case AdminConstants.MAIN_PRELOADER_CHANGE_STATE:
			return mainPreloaderStateChanged(action, state);
		default:
			return state;
	}
}

export default UIReducer;
