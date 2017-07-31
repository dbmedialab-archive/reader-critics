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
import  notFoundHandler  from './notFoundHandler';
const log = app.createLog();

// Prepare and export Express router

const homeRoute : Router = Router();

homeRoute.get('/', homeHandler);
homeRoute.get('/*', notFoundHandler);

export default homeRoute;

const mainTemplate = createMainTemplate();

const styles = [
	'/static/styles/home.css',
];

const scripts = [];

// Main handler, checks for URL parameter and "empty" requests

function homeHandler(requ : Request, resp : Response) {
	log('Homepage router', requ.params);
	resp.set('Content-Type', 'text/html');
	resp.send(mainTemplate({
		styles,
		scripts,
	}));

	resp.status(200).end();
}

// Everything else
function createMainTemplate() {
	// Currently loads the template from a static file.
	// The template will later be determined dynamically based on website url / domain.
	const templatePath : string = path.join(app.rootPath, 'assets/templates/home.html');
	const templateRaw : string = readFileSync(templatePath).toString();

	return doT.template(templateRaw);
}
