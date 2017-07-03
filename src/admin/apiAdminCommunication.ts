import 'whatwg-fetch';

const rxUnencoded = /:\/\//;

export const sendAuthRequest = ((data: any): Promise<any> => {
	const apiUrl = `/admin/login`;
	const {login, password} = data;
	return fetch(apiUrl, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({login, password}),
	}).then(status)
		.then(function (resp) {
			console.log(resp);
		});
});

function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	throw new Error(response.statusText);
}

function json(response) {
	return response.json();
}
