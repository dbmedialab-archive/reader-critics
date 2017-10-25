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
	Router,
} from 'express';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import {
	loginHandler,
	logoutHandler
} from './ui/handlers';

import { secret } from 'app/middleware/config/sessionConfig';

import isAuthenticated from 'app/middleware/policies/isAuthenticated';
import isNotAuthenticated from 'app/middleware/policies/isNotAuthenticated';
import PageTemplate from 'app/template/PageTemplate';
import {localizationService, templateService} from 'app/services';
import {systemLocale} from 'app/services/localization';

import * as app from 'app/util/applib';

const log = app.createLog();

const adminRoute : Router = Router();

adminRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));

adminRoute.use(bodyParser.urlencoded({
	extended: true,
}));

adminRoute.use(cookieParser(secret));

adminRoute.get('/login', isNotAuthenticated, adminPageHandler);
adminRoute.post('/login', isNotAuthenticated, loginHandler);
adminRoute.get('/logout', isAuthenticated, logoutHandler);
adminRoute.get([
	'/',
	'/users',
	'/feedbacks',
	'/articles',
	'/articles/:id',
	'/websites',
	'/suggestions',
], isAuthenticated, adminPageHandler);

adminRoute.get('/*', notFoundHandler);

export default adminRoute;

function notFoundHandler(requ : Request, resp : Response) : void {
	log(requ.params);
	resp.status(404).end('Unknown admin endpoint\n');
}

function adminPageHandler(requ : Request, resp : Response) {
	log('admin test page loaded');

	return Promise
		.all([
			templateService.getAdminPageTemplate(),
			localizationService.getFrontendStrings(),
		])
		// Use the page template, inject parameters and serve to the client
		.spread((template : PageTemplate, localStrings : any) => {
			resp.set('Content-Type', 'text/html')
				.send(template.setParams({
					localization: {
						locale: systemLocale,
						messages: localStrings,
					},
					title: 'Leserkritikkk: Admin panel',	//TODO fix it when localization ready
				}).render())
				.status(200).end();
		});
}
