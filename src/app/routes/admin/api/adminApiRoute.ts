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

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import * as userHandler from 'app/routes/admin/api/usersHandler';
import * as feedbacksHandler from 'app/routes/admin/api/feedbacksHandler';
import * as articlesHandler from 'app/routes/admin/api/articlesHandler';
import * as websitesHandler from 'app/routes/admin/api/websitesHandler';
import * as suggestionsHandler from 'app/routes/admin/api/suggestionsHandler';

import { errorResponse } from 'app/routes/api/apiResponse';

import isAuthenticatedApi from 'app/middleware/policies/isAuthenticatedApi';

const adminApiRoute : Router = Router();

adminApiRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));

adminApiRoute.use(cookieParser());
/**
 * All api request that have NOT to to pass without authentication have to be placed here
 */
adminApiRoute.get('/users/editors', isAuthenticatedApi, userHandler.editorsList);
adminApiRoute.get('/users', isAuthenticatedApi, userHandler.list);
adminApiRoute.post('/users', isAuthenticatedApi, userHandler.create);
adminApiRoute.delete('/users/:id', isAuthenticatedApi, userHandler.doDelete);
adminApiRoute.put('/users/:id', isAuthenticatedApi, userHandler.update);
adminApiRoute.get('/fb', isAuthenticatedApi, feedbacksHandler.list);
adminApiRoute.get('/articles', isAuthenticatedApi, articlesHandler.list);
adminApiRoute.get('/articles/:id', isAuthenticatedApi, articlesHandler.show);
adminApiRoute.get(
	'/articles/:id/feedbacks', isAuthenticatedApi, articlesHandler.getArticleFeedbacks);
adminApiRoute.get('/websites', isAuthenticatedApi, websitesHandler.list);
adminApiRoute.post('/websites', isAuthenticatedApi, websitesHandler.create);
adminApiRoute.get('/websites/:name', isAuthenticatedApi, websitesHandler.show);
adminApiRoute.patch('/websites/:name', isAuthenticatedApi, websitesHandler.update);
adminApiRoute.get('/suggestions', isAuthenticatedApi, suggestionsHandler.list);
adminApiRoute.get('/*', defaultHandler);

export default adminApiRoute;

function defaultHandler(requ: Request, resp: Response) : void {
	errorResponse(resp, undefined, 'Unknown API endpoint', { status: 404 });
}
