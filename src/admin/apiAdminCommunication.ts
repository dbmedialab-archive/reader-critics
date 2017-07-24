import 'whatwg-fetch';

/**
 * Sends an authentication request
 * @type {(data:any)=>Promise<any>}
 */
export const sendAuthRequest = ((data: any): Promise<any> => {
	return sendRequest(`/admin/login/`, 'POST', data);
});

/**
 * Test request to be sure that we cn get data from admin api
 * TODO remove it after any one real admin api request is done
 * @type {()=>Promise<any>}
 */
export const sendUsersRequest = ((): Promise<any> => {
	return sendRequest(`/admin/api/users/`, 'GET');
});

/**
 * Wrapper to send requests to backend
 * @param url                   URL to get data from
 * @param method                Request method
 * @param data                  Request data
 * @returns {Promise<any>}
 */
function sendRequest(url: string, method: string = 'GET', data?: any): Promise<any> {
	return fetch(url, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: data ? JSON.stringify(data) : null,
		credentials: 'include',
	})
	.then(authCheck)
	.then(status)
	.then(json)
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
 * Check for errors from backend
 * @param response
 * @returns {any}
 */
function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	return response.json().then(json => {
		throw new Error(json.message || response.statusText);
	});
}

/**
 * Gets the JSON data from request
 * @param response
 * @returns {any}
 */
function json(response) {
	return response.json();
}
