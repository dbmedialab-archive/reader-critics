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

import articleHandler from './api/articleHandler';
import feedbackPostHandler from './api/feedbackPostHandler';
import suggestionHandler from './api/suggest';

import * as app from 'app/util/applib';

const log = app.createLog();

// Prepare and export Express router

const apiRoute : Router = Router();

apiRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));

apiRoute.get('/article', articleHandler);
apiRoute.put('/feedback', feedbackPostHandler);
apiRoute.post('/suggest', suggestionHandler);

apiRoute.get('/*', defaultHandler);

export default apiRoute;

function defaultHandler(requ : Request, resp : Response) : void {
	log('Default API router');
	resp.status(404).end('Unknown API endpoint\n');
}
