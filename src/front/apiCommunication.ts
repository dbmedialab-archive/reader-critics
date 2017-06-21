import {
	default as axios,
	AxiosPromise,
	AxiosResponse,
} from 'axios';

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

export function sendSuggestion(data: any) : Promise<any> {
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
}
