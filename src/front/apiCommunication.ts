import {
	default as axios,
	AxiosResponse,
} from 'axios';

import 'whatwg-fetch'

console.log(fetch);



const rxUnencoded = /:\/\//;

export function fetchArticle(url : string, version : string) : Promise<any> {
	const encodedURL = rxUnencoded.test(url)
		? encodeURIComponent(url)
		: url;

	return axios.get(`/api/article/?url=${encodedURL}`)
	.then((resp : AxiosResponse) => {
		const d = resp.data;

		if (d.success === true) {
			return d.data.article;
		}

		return Promise.reject(new Error(`Failed to load article at ${url}`));
	});
}

/*export function sendSuggestion(data: any) : Promise<any> {
	const apiUrl = `/api/suggest/`;

	return axios.post(apiUrl, {
		data,
	})
		.then((resp : AxiosResponse) => {
			const d = resp.data;

			if (d.success === true) {
				console.log(d);
				return d.data;
			}

			return Promise.reject(new Error(`Failed to send Suggestion form`));
		});
}*/


export const sendSuggestion = ((data: any): Promise<any> => {
	console.log(JSON.stringify(data));
	const apiUrl = `/api/suggest/`;
	return fetch(apiUrl, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(data)
	}).then(checkStatus)
		.then(r => r.json())
		.then(data => {
			console.log(data);
		});
});

const checkStatus = ((response: any) => {
  if (response.ok) {
	  return response;
  } else {
    var error = new Error(response.statusText);
	console.log(error);
    //return Promise.reject(error);
  }
})
