import {
	AxiosResponse,
	default as axios,
} from 'axios';

import ArticleURL from 'base/ArticleURL';

import * as app from 'app/util/applib';

const log = app.createLog();

/**
 * @param url The source of the article
 * @return Whatever the request returned, as a plain string
 */
export default function(url : ArticleURL) : Promise <string> {
	log(url.href);
	return axios.get(url.href).then((resp : AxiosResponse) => resp.data);
}
