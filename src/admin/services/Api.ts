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
import {sendRequest} from 'admin/apiAdminCommunication';
const Api = {
	/**
 * Get all feedbacks
 * @type {()=>Promise<any>}
 */
	getFeedbacksList: () =>
		sendRequest(`/admin/api/fb/`, 'GET'),

	/**
	 * Save or update user
	 * @type {(data: any) => Promise<any>}
	 */
	saveUser:(data: any): Promise<any> => {
		const userId = data.id || '';
		const method = userId.length ? 'PUT' : 'POST';
		return sendRequest(`/admin/api/users/${userId}`, method, data);
	},

	/**
	 * Get users
	 * @type {() => Promise<any>}
	 */

	getUsers:(): Promise<any> =>
		sendRequest(`/admin/api/users`, 'GET'),

	/**
	 * Delete User
	 * @type {(userId: any) => Promise<any>}
	 */

	deleteUser:(userId: any): Promise<any> =>
		sendRequest(`/admin/api/users/${userId}`, 'DELETE'),
};
export default Api;
