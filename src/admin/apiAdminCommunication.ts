import 'whatwg-fetch';
import { showError } from 'front/uiHelpers';
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
		headers: { 'Content-Type': 'application/json' },
		body: data ? JSON.stringify(data) : null,
		credentials: 'include',
	})
	.then(authCheck)
	.then(status)
	.catch(function (error) {
		console.log('request failed', error);
		return {error: error.message};
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
		window.history.pushState({}, 'Authorization', '/admin/login');
		throw new Error(response.statusText);
	} else {
		return response;
	}
}

/**
 * Save or update user
 * @type {(data: any) => Promise<any>}
 */
export const saveUser = ((data: any): Promise<any> => {
	const userId = data.id || '';
	const method = userId.length ? 'PUT' : 'POST';
	return sendRequest(`/admin/api/users/${userId}`, method, data);
});
/**
 * Get users
 * @type {() => Promise<any>}
 */
export const getUsers = ((): Promise<any> =>
	sendRequest(`/admin/api/users`, 'GET'));

/**
 * Delete User
 * @type {(userId: any) => Promise<any>}
 */
export const deleteUser = ((userId: any): Promise<any> =>
	sendRequest(`/admin/api/users/${userId}`, 'DELETE'));

/**
 * Check for errors from backend
 * @param resp
 * @returns {any}
 */
function status(resp : Response) : Promise <any> {
	const bail = (message) => {
		showError(message);
		return Promise.reject(Promise.reject(new Error(message)));
	};

	return resp.json().then((payload) => {
		if (resp.status < 200 || resp.status >= 300 || !payload.success) {
			return bail(payload.message || payload.error || resp.statusText);
		}

		if (!payload.data) {
			return bail('No "data" property in response payload');
		}

		return payload.data;
	});
}

