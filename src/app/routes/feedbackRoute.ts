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

import * as Promise from 'bluebird';

import * as bodyParser from 'body-parser';

import {
	Request,
	Response,
	Router,
} from 'express';

import ArticleURL from 'base/ArticleURL';
import PageTemplate from 'app/template/PageTemplate';
import Website from 'base/Website';

import {
	localizationService,
	templateService,
	websiteService,
} from 'app/services';

import { NotFoundError } from 'app/util/errors';

import * as app from 'app/util/applib';

const log = app.createLog();
const __ = localizationService.translate;

type FeedbackParams = {
	url : ArticleURL;
	version : string|null;
};

// Prepare and export Express router

const feedbackRoute : Router = Router();

feedbackRoute.use(bodyParser.urlencoded({
	extended: true,
}));

feedbackRoute.get('/*', getHandler);

export default feedbackRoute;

// Main handler

function getHandler(requ : Request, resp : Response, next : Function) : void {
	parseParameters(requ).then((params : FeedbackParams) => {
		log(app.inspect(params));
		return feedbackHandler(requ, resp, params.url, params.version);
	})
	.catch((error : Error) => next(error));
}

function parseParameters(requ : Request) : Promise <FeedbackParams> {
	const hasSingleParam = requ.params[0].length > 0;
	const hasQueryParams = Object.getOwnPropertyNames(requ.query).length > 0;

	if (hasSingleParam && !hasQueryParams) {
		return Promise.resolve(ArticleURL
		.from(requ.params[0].trim()))
		.then((url : ArticleURL) : FeedbackParams => ({
			url,
			version: null,
		}));
	}
	else if (!hasSingleParam && hasQueryParams) {
		log('query:', app.inspect(requ.query));
		let url : string;

		if (requ.query.url) {
			url = requ.query.url.trim();
		}
		else if (requ.query.articleURL) {
			url = requ.query.articleURL.trim();
		}
		else {
			log('Failed to parse query parameters, couldn\'t find article URL');
			return Promise.reject(new NotFoundError(__('err.no-url-param')));
		}

		return Promise.resolve(ArticleURL.from(url))
		.then((articleURL : ArticleURL) : FeedbackParams => {
			return {
				url: articleURL,
				version: requ.query.version ? requ.query.version.trim() : null,
			};
		});
	}

	return Promise.reject(new NotFoundError(__('err.invalid-param')));
}

// Serve feedback page

function feedbackHandler(
	requ : Request,
	resp : Response,
	articleURL : ArticleURL,
	version : string
) {
	log('Feedback to "%s" version "%s"', articleURL, version);

	// Identify the website to make sure we are actually responsible for this
	// content and also load the page template
	let website : Website;

	return Promise.resolve(websiteService.identify(articleURL)).then((w : Website) => {
		if (w === null) {
			return Promise.reject(new NotFoundError(__('err.no-website-identify')));
		}

		website = w;

		// Now that we have a website object, load template and localization in parallel:
		return Promise.all([
			templateService.getFeedbackPageTemplate(website),
			localizationService.getFrontendStrings(website),
		]);
	})
	// Use the page template, inject parameters and serve to the client
	.spread((template : PageTemplate, locaStrings : any) => {
		resp.set('Content-Type', 'text/html')
		.send(template.setParams({
			article: {
				url: articleURL.href,
				version,
			},
			localization: {
				locale: website.locale,
				messages: locaStrings,
			},
		}).render())
		.status(200).end();
		return null;
	});
}
