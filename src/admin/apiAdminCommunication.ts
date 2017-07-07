import 'whatwg-fetch';

// const currentView = document.getElementById('app').getAttribute('name');

export const sendAuthRequest = ((data: any): Promise<any> => {
	const apiUrl = `/admin/login/`;
	return fetch(apiUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
		credentials: 'include',
	})
	.then(authCheck)
	.then(status)
	.then(json)
	.catch(function (error) {
		console.log('request failed', error);
	});
});

export const sendUsersRequest = ((): Promise<any> => {
	const apiUrl = `/admin/api/users/`;
	return fetch(apiUrl, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
	})
	.then(authCheck)
	.then(status)
	.then(json)
	.catch(function (error) {
		console.log('request failed', error);
	});
});

function authCheck(response) {
	const currentPath = window.location.pathname;

	if (currentPath === '/admin/login') {
		if (response.status !== 200) {
			return response;
		}
		window.location.pathname = 'admin/testpage';
		return response;
	}

	if (response.status === 401) {
		document.getElementById('app').setAttribute('name', 'login');
		throw new Error(response.statusText);
	} else {
		/** That might work on previous app structure
			 if (document.getElementById('app').getAttribute('name') !== currentView) {
			    document.getElementById('app').setAttribute('name', currentView);
			 }
			 return response;
		 */
		window.location.pathname = '/admin/testpage';
	}
}

function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	throw new Error(response.statusText);
}

function json(response) {
	return response.json();
}
