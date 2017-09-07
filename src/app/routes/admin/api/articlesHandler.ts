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
	Request,
	Response,
} from 'express';

import {
	errorResponse, okApiResponse,
} from 'app/routes/api/apiResponse';

import {articleService, feedbackService} from 'app/services';

import pagination from 'app/util/pagination';

/**
 * Provides with whole list of existing articles
 */
export function list (requ: Request, resp: Response) {
	const params = pagination(requ);
	const {skip, limit, sort} = params;
	return Promise.all([
					articleService.getRangeWithFBCount(skip, limit, sort),
					articleService.getAmount(),
				])
				.then(data => {
					const [articles, amount] = data;
					const pages = Math.ceil(amount / limit);
					return okApiResponse(resp, {articles, pages});
				})
				.catch(err => errorResponse(resp, undefined, err, { status: 500 }));
}

/**
 * Get article by id
 */
export function show (requ: Request, resp: Response) {
	const ID = requ.params.id;
	return articleService.getByID(ID)
				.then(article => okApiResponse(resp, article))
				.catch(err => errorResponse(resp, undefined, err, { status: 500 }));
}

export function getArticleFeedbacks(requ: Request, resp: Response) {
	const ID = requ.params.id;
	const params = pagination(requ);
	const {skip, limit, sort} = params;
	return articleService.getByID(ID)
		.then(article => {
			return Promise.all([
				feedbackService.getByArticle(article, skip, limit, sort),
				feedbackService.getAmountByArticle(article),
			]);
		})
		.then(data => {
			const [feedbacks, amount] = data;
			const pages = Math.ceil(amount / limit);
			return okApiResponse(resp, {feedbacks, pages});
		})
		.catch(err => errorResponse(resp, undefined, err, { status: 500 }));
}
