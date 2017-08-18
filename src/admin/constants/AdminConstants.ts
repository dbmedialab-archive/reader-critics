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

import * as keykey from 'keykey';
const AdminConstants = keykey([
	'MAIN_PRELOADER_CHANGE_STATE',
	'MODAL_STATE_CHANGED',
	'MODAL_INIT',
	'RESET_FORM_INPUT',
	'TOPBAR_SUBMENU_STATE_CHANGED',
	'TOPBAR_ACCOUNTMENU_STATE_CHANGED',

	//Modal windows names
	'TEST_MODAL_WINDOW',
	'PROMPT_MODAL_WINDOW',
	'DIALOG_MODAL_WINDOW',
	'LOGIN_DIALOG_MODAL_WINDOW',

	//User actions
	'AUTHENTICATE_USER',
	'DEAUTHENTICATE_USER',
	'UPDATE_CURRENT_USER',

	//Comments
	'FEEDBACK_LIST_RECEIVED',
]);

export default AdminConstants;
