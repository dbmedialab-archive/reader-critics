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

import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as app from 'app/util/applib';
import {apiLoginHandler, apiTestHandler} from 'app/routes/admin/api/handlers';
import isAuthenticatedApi from 'app/middleware/policies/isAuthenticatedApi';

const log = app.createLog();

const adminApiRoute : Router = Router();

adminApiRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));
adminApiRoute.use(cookieParser());

/**
 * All api request that have to pass without authentication have to be placed here
 */
adminApiRoute.post('/login', apiLoginHandler);

// Protecting routes with jwt
// adminApiRoute.use('/*', passport.authenticate('jwt', {session: false}));
/**
 * All api request that have NOT to to pass without authentication have to be placed here
 */
adminApiRoute.get('/users', isAuthenticatedApi, apiTestHandler);
adminApiRoute.get('/*', defaultHandler);

export default adminApiRoute;

function defaultHandler(requ: Request, resp: Response) : void {
	log('Admin api router', requ.params);
	resp.status(404).end('Unknown admin api endpoint\n');
}
