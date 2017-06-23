import 'whatwg-fetch'


const rxUnencoded = /:\/\//;

export function fetchArticle(url: string, version: string): Promise<any> {
	const encodedURL = rxUnencoded.test(url)
		? encodeURIComponent(url)
		: url;

	return fetch(`/api/article/?url=${encodedURL}`)
		.then(function (response: Response) {
			return response.json()
		}).then(function (json) {
			console.log('parsed json', json)
		}).catch(function (ex) {
			console.log('parsing failed', ex)
		})
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


/*export const sendSuggestion = ((data: any): Promise<any> => {
	console.log(JSON.stringify(data));
	const apiUrl = `/api/suggest/`;
	return fetch(apiUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	}).then(function (response: Response) {
		console.log(response);
		return response.json()
	}).then(function (json) {
		console.log('parsed json', json)
	}).catch(function (ex) {
		console.log('parsing failed', ex)
	})
});*/

export const sendSuggestion = ((data: any): Promise<any> => {
	const apiUrl = `/api/suggest/`;
	return fetch(apiUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(function (data) {
			console.log('request succeeded with JSON response', data)
		}).catch(function (error) {
			console.log('request failed', error)
		})
});


function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
	throw error
  }
}
 
function parseJSON(response) {
  return response.json()
}