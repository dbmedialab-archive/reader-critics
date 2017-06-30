import 'whatwg-fetch';

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
