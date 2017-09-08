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
import {getFormattedPagination} from 'admin/services/Utils';

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
	 * Get all websites
	 * @type {()=>Promise<any>}
	 */
	getWebsiteList: function() {
		return sendRequest(`/admin/api/websites/`, 'GET');
	},

	/**
	 * Get website data by name
	 * @type {()=>Promise<any>}
	 */
	getSelectedWebsite: function(name) {
		return sendRequest(`/admin/api/websites/${name}`, 'GET');
	},

	/**
	 * Send website data to update
	 * @type {()=>Promise<any>}
	 */
	updateWebsite: function(data) {
		const {currentName} = data;
		delete data.currentName;
		return sendRequest(`/admin/api/websites/${currentName}`, 'PATCH', data);
	},

	/**
	 * Send website data to create a new one
	 * @type {()=>Promise<any>}
	 */
	createWebsite: function(data) {
		return sendRequest(`/admin/api/websites`, 'POST', data);
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

	/**
	 * Get all articles with feedbacks count
	 * @type {()=>Promise<any>}
	 */
	getArticleList: (page?, limit?, sort?, sortOrder?) => {
		const pagination = getFormattedPagination(page, limit, sort, sortOrder);
		return sendRequest(`/admin/api/articles${pagination}`, 'GET');
	},

	/**
	 * Get article by ID
	 */
	getArticle: (id) =>
		sendRequest(`/admin/api/articles/${id}`, 'GET'),

	/**
	 * Get feedbacks belong to article by ID
	 */
	getArticleFeedbacks: (id, page?, limit?, sort?, sortOrder?) => {
		const pagination = getFormattedPagination(page, limit, sort, sortOrder);
		return sendRequest(`/admin/api/articles/${id}/feedbacks${pagination}`, 'GET');
	},
};
export default Api;
