//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

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
	console.log('reset form input');
	console.log(state);
	console.log(action);
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

function topbarSubmenuChangeState(action, state) {
	return state.merge({'topbar': {'submenu': action.payload}}, {deep: true});
}
function topbarAccountMenuChangeState(action, state) {
	return state.merge({'topbar': {'accountMenu': action.payload}}, {deep: true});
}

function mainPreloaderStateChanged(action, state) {
	interface PreloaderOptios {
		isVisible?: boolean;
		countOfPreloaders?: number;
		color?: string;
	}
	const mainPreloader = state.getIn(['mainPreloader']),
		options : PreloaderOptios = {};
	let	countOfPreloaders = mainPreloader.getIn(['mainPreloader','countOfPreloaders']);
	options.isVisible = action.payload.isVisible;
	if (options.isVisible) {
		countOfPreloaders++;
	} else {
		countOfPreloaders--;
		if (countOfPreloaders > 0) {
			options.isVisible = true;
		}
	}
	options.countOfPreloaders = countOfPreloaders;
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
		case AdminConstants.TOPBAR_SUBMENU_STATE_CHANGED:
			return topbarSubmenuChangeState(action, state);
		case AdminConstants.TOPBAR_ACCOUNTMENU_STATE_CHANGED:
			return topbarAccountMenuChangeState(action, state);
		default:
			return state;
	}
}

export default UIReducer;
