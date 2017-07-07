import 'whatwg-fetch';

// const currentView = document.getElementById('app').getAttribute('name');

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
		if (response.status !== 200) {
			return response;
		}
		window.location.pathname = 'admin/testpage';
		return response;
	}

	if (response.status === 401) {
		/** That might work on previous app structure
		 document.getElementById('app').setAttribute('name', 'login');
		 */
		window.location.pathname = '/admin/login';
		throw new Error(response.statusText);
	} else {
		/** That might work on previous app structure
			 if (document.getElementById('app').getAttribute('name') !== currentView) {
			    document.getElementById('app').setAttribute('name', currentView);
			 }
			 return response;
		 */
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
	throw new Error(response.statusText);
}

/**
 * Gets the JSON data from request
 * @param response
 * @returns {any}
 */
function json(response) {
	return response.json();
}
