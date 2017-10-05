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

import { getLocale } from 'front/uiGlobals';
import { showError } from 'front/uiHelpers';

const apiMIME = 'application/json';
const rxUnencoded = /:\/\//;

// Fetch data

export const fetchArticle = ((url : string, version : string) : Promise <any> => {
	const encURL = rxUnencoded.test(url)
		? encodeURIComponent(url)
		: url;
	const encVersion = encodeURIComponent(version);

	return fetchData(`/api/article/?url=${encURL}&version=${encVersion}`)
	.then(data => data.article);
});

// Send all kinds of data

export const sendFeedback = ((data : any) : Promise <any> => {
	return postData('/api/feedback/', data).then(checkStatus);
});

export const sendSuggestion = ((data : any) : Promise <any> => {
	return postData('/api/suggest/', data).then(checkStatus);
});

// GET data

function fetchData(url : string) : Promise <any> {
	return fetch(url, {
		method: 'GET',
		headers: {
			'Accept': apiMIME,
			'Accept-Language': getLocale(),
		},
	})
	.then(checkStatus);
}

// POST data

function postData(uri : string, data : any) : Promise <any> {
	return sendData('POST', uri, data);
}

function sendData(method: 'POST' | 'PUT', uri : string, data : any) : Promise <any> {
	return fetch(uri, {
		method: method,
		headers: {
			'Accept-Language': getLocale(),
			'Content-Type': apiMIME,
		},
		body: JSON.stringify(data),
	});
}

// Check response for success and display error popup if necessary

function checkStatus(resp : Response) : Promise <any> {
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
