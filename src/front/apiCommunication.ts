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

import { showError } from 'front/uiHelpers';
import EndUser from 'base/EndUser';

const rxUnencoded = /:\/\//;

// Fetch data

export const fetchArticle = ((url : string, version : string) : Promise <any> => {
	const encURL = rxUnencoded.test(url)
		? encodeURIComponent(url)
		: url;
	const encVersion = encodeURIComponent(version);

	return fetch(`/api/article/?url=${encURL}&version=${encVersion}`)
	.then(checkStatus)
	.then(data => data.article);
});

// Send all kinds of data

export const sendFeedback = ((data : any) : Promise <any> => {
	return postData('/api/feedback/', data).then(checkStatus);
});
export const sendFeedbackUser = ((id: string, data : {user: EndUser}) : Promise <any> => {
	return putData(`/api/feedback/${id}/enduser`, data).then(checkStatus);
});

export const sendSuggestion = ((data : any) : Promise <any> => {
	return postData('/api/suggest/', data).then(checkStatus);
});

function sendData(method: 'POST' | 'PUT', uri : string, data : any) : Promise <any> {
	return fetch(uri, {
		method: method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
}

// PUT data

function putData(uri : string, data : any) : Promise <any> {
	return sendData('PUT', uri, data);
}

// POST data

function postData(uri : string, data : any) : Promise <any> {
	return sendData('POST', uri, data);
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
