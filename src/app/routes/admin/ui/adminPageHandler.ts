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

//TO DO remove this test page
import * as doT from 'dot';
import * as path from 'path';

import { readFileSync } from 'fs';

import {
	Request,
	Response,
} from 'express';

import * as app from 'app/util/applib';

const log = app.createLog();

const mainTemplate = createMainTemplate();

const styles = [
	'/static/admin.css',
];

const scripts = [
	'/static/react/react.js',
	'/static/react/react-dom.js',
	'/static/admin.bundle.js',
];

// Respond with initial HTML, process template for feedback form page

export default function (requ : Request, resp : Response) {
	log('admin test page loaded');

	resp.set('Content-Type', 'text/html')
		.send(mainTemplate({
		styles,
		scripts,
	}))
	.status(200)
	.end();
}

function createMainTemplate() {
	// Currently loads the template from a static file.
	// The template will later be determined dynamically based on website url / domain.
	const templatePath = path.join(app.rootPath, 'tmp/templates/admin.html');
	const templateRaw = readFileSync(templatePath);

	return doT.template(templateRaw);
}
