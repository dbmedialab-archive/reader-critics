// fake-widget

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

import * as app from 'app/util/applib';
import * as doT from 'dot';
import * as path from 'path';

import { readFileSync } from 'fs';

// Prepare and export Express router

const fakeWidgetRoute : Router = Router();
export default fakeWidgetRoute;

// Main handler, checks for URL parameter and "empty" requests

fakeWidgetRoute.get('/', fakeWidgetHandler);

const mainTemplate = createMainTemplate();

function fakeWidgetHandler(requ : Request, resp : Response) {
	resp.set('Content-Type', 'text/html');
	resp.send(mainTemplate());
	resp.status(200).end();
}

function createMainTemplate() {
	const tplPath = path.join(app.rootPath, 'tmp', 'templates', 'fake-widget.html');
	return doT.template(readFileSync(tplPath).toString());
}
