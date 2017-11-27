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

import 'whatwg-fetch';
import * as UIActions from 'admin/actions/UIActions';
import AdminConstants from 'admin/constants/AdminConstants';

/**
 * Sends an authentication request
 * @type {(data:any)=>Promise<any>}
 */
export const sendAuthRequest = ((data: any): Promise<any> => {
	return sendRequest(`/admin/login/`, 'POST', data);
});

/**
 * Wrapper to send requests to backend
 * @param url                   URL to get data from
 * @param method                Request method
 * @param data                  Request data
 * @returns {Promise<any>}
 */
export function sendRequest(url: string, method: string = 'GET', data?: any): Promise<any> {
	return fetch(url, {
		method,
		headers: [
			[ 'Content-Type', 'application/json' ],
		],
		body: data ? JSON.stringify(data) : null,
		credentials: 'include',
	})
		.then(authCheck)
		.then(status)
		.then(json)
		.catch(function (error) {
			console.log('request failed', error);
			throw new Error(error.message);
		});
}

/**
 * Checks the authentication on client side
 * @param response
 * @returns {any}
 */
function authCheck(response: Response): any {
	const currentPath = window.location.pathname;

	if (currentPath === '/admin/login') {
		return response;
	}

	if (response.status === 401) {
		UIActions.hideMainPreloader();
		UIActions.showDialog({
			yesBtnName: 'Sign IN',
			dialogTitle: 'Authentication session lost. Please, try to login again.',
			onlyAcceptable: true,
			yesHandler: () => window.location.href = '/admin/login',
			closeHandler: () => window.location.href = '/admin/login',
		});
		throw new Error(response.statusText);
	} else {
		return response;
	}
}

/**
 * Check for errors from backend
 * @param response
 * @returns {any}
 */
function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	return response.json().then(data => {
		throw new Error(data.message || response.statusText);
	});
}

/**
 * Gets the JSON data from request
 * @param response
 * @returns {any}
 */
function json(response) {
	return response.json().then((payload) => {
		if (response.status < 200 || response.status >= 300 || !payload.success) {
			return payload.message || payload.error || response.statusText;
		}

		if (!payload.data) {
			return 'No "data" property in response payload';
		}

		return payload.data;
	});
}
