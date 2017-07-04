import 'whatwg-fetch';
import AuthenticationError from 'admin/errors/AuthenticationError';

const rxUnencoded = /:\/\//;

function authCheck(response) {
	if (response.status !== 401) {
		return response;
	}
	window.location.href = '/admin/login';
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
