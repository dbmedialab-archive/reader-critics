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

import AdminConstants from 'admin/constants/AdminConstants';
export interface IAction {
		type: any;
		payload?: any;
}

export type TAction = IAction;
export function initModalWindows(payload): IAction {
	return {
		type: AdminConstants.MODAL_INIT,
		payload,
	};
}
export function modalWindowsChangeState(payload): IAction {
	return {
		type: AdminConstants.MODAL_STATE_CHANGED,
		payload,
	};
}

export function toggleMainPreloader(payload): IAction {
	return {
		type: AdminConstants.MAIN_PRELOADER_CHANGE_STATE,
		payload,
	};
}

export function closeReset(payload): IAction {
	return {
		type: AdminConstants.RESET_FORM_INPUT,
		payload,
	};
}

export function topbarSubmenuChangeState(payload): IAction {
	return {
		type: AdminConstants.TOPBAR_SUBMENU_STATE_CHANGED,
		payload,
	};
}

export function topbarAccountMenuChangeState(payload): IAction {
	return {
		type: AdminConstants.TOPBAR_ACCOUNTMENU_STATE_CHANGED,
		payload,
	};
}
