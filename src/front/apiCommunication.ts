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
import {showError} from 'front/uiHelpers';

const rxUnencoded = /:\/\//;

const json = (response) => response.json().then(j => j.data);

export const fetchArticle = ((url: string, version: string): Promise<any> => {
	const encodedURL = rxUnencoded.test(url)
		? encodeURIComponent(url)
		: url;

	return fetch(`/api/article/?url=${encodedURL}`)
		.then(status)
		.then(json)
		.then(data => data.article)
		.catch(function (error) {
			//TO DO make errors
			showError('Something went wrong', ()=>{alert('this is a callback');});
			console.log('request failed', error);
		});
});

export const sendSuggestion = ((data: any): Promise<any> => {
	return fetch('/api/suggest/', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})
	.then(status)
	.then(json)
	.catch(function (error) {
		console.log('request failed', error);
	});
});

function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	throw new Error(response.statusText);
}
