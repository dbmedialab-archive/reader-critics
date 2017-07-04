import 'whatwg-fetch';

const rxUnencoded = /:\/\//;

function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	throw new Error(response.statusText);
}

function json(response) {
	return response.json();
}
