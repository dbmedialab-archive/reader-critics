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
