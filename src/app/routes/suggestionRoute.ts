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

import { readFileSync } from 'fs';

import * as doT from 'dot';
import * as path from 'path';

import config from 'app/config';

import * as app from 'app/util/applib';

const suggestionRoute : Router = Router();

suggestionRoute.get('/', suggestionHandler);

export default suggestionRoute;

// Template stuff
const templateName = 'tmp/templates/suggestion.html';

const styles = [
	'/static/front.css',
];

const scripts = [
	'/static/react/react.js',
	'/static/react/react-dom.js',
	'/static/front.bundle.js',
	'//www.google.com/recaptcha/api.js?hl=no', // TODO Change language for recaptcha
];

const mainTemplate = createTemplate();

function suggestionHandler(requ : Request, resp : Response) {
	resp.set('Content-Type', 'text/html')
	.send(mainTemplate({
		recaptcha: JSON.stringify({
			publicKey: config.get('recaptcha.key.public'),
		}),
		styles,
		scripts,
	}))
	.status(200).end();
}

function createTemplate() {
	// Currently loads the template from a static file.
	// The template will later be determined dynamically based on website url / domain.
	const templatePath : string = path.join(app.rootPath, templateName);
	const templateRaw : string = readFileSync(templatePath).toString();

	return doT.template(templateRaw);
}
