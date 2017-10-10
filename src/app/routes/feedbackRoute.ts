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

import * as bodyParser from 'body-parser';

import {
	Request,
	Response,
	Router,
} from 'express';

import { isEmpty } from 'lodash';

import ArticleURL from 'base/ArticleURL';
import PageTemplate from 'app/template/PageTemplate';
import Website from 'base/Website';

import {
	localizationService,
	templateService,
	websiteService,
} from 'app/services';

import {
	InvalidRequestError,
	NotFoundError,
} from 'app/util/errors';

import * as app from 'app/util/applib';

const log = app.createLog();
const __ = localizationService.translate;

// Prepare and export Express router

const feedbackRoute : Router = Router();

feedbackRoute.use(bodyParser.urlencoded({
	extended: true,
}));

feedbackRoute.get('/', getHandler);
feedbackRoute.post('/', postHandler);

export default feedbackRoute;

// Main handlers, check the URL and version parameters

function getHandler(requ : Request, resp : Response, next : Function) : void {
	let version : string;

	checkVersionParameter(requ.query.version)
	.then((v : string) => {
		version = v;
		return ArticleURL.from(requ.query.articleURL);
	})
	.then(articleURL => feedbackHandler(requ, resp, articleURL, version))
	.catch((error : Error) => next(error));
}

function postHandler(requ : Request, resp : Response, next : Function) : void {
	let version : string;

	checkVersionParameter(requ.body.version)
	.then((v : string) => {
		version = v;
		return ArticleURL.from(requ.body.articleURL);
	})
	.then(articleURL => feedbackHandler(requ, resp, articleURL, version))
	.catch((error : Error) => next(error));
}

// Common parameter check

function checkVersionParameter(rawVersion : string) : Promise <string> {
	return isEmpty(rawVersion)
		? Promise.reject(new InvalidRequestError(__('err.no-version-param')))
		: Promise.resolve(rawVersion.trim());
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

	return websiteService.identify(articleURL).then((w : Website) => {
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
		//	signed: 'NUdzNVJRdUdmTzd0ejFBWGwxS2tZRDVrRzBldTVnc0RDc2VheGdwego=',
		}).render())
		.status(200).end();
	});
}
