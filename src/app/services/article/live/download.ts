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

import {
	default as axios,
	AxiosResponse,
} from 'axios';

import ArticleURL from 'base/ArticleURL';

import * as app from 'app/util/applib';
import { NotFoundError } from 'app/util/errors';

const log = app.createLog();

/**
 * @param url The source of the article
 * @return Whatever the request returned, as a plain string
 */
export default function(url : ArticleURL) : Promise <string> {
	log(url.href);
	return axios.get(url.href)
	.then((resp : AxiosResponse) => resp.data)
	.catch(error => {
		if (error.response) {
			if (error.response.status === 404) {
				return Promise.reject(new NotFoundError('Article does not exist'));
			}
			return Promise.reject(new Error(`Article website returned a ${error.response.status} code`));
		}

		return Promise.reject(error);
	});
}
