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

import ArticleURL from 'base/ArticleURL';
import { EmptyError } from 'app/util/errors';

import emptyHandler from './feedback/emptyHandler';
import feedbackHandler from './feedback/feedbackHandler';
import paramErrorHandler from './feedback/paramErrorHandler';

const log = app.createLog();

// TODOs:
// - URL parsen und Hostnamen extrahieren (parser-package? warsch "url", Node API)
// - Hostnamen mit Datenbank abgleichen und Record des Kunden holen
// - Styling und Template laden
// - Templatecache für bereits geladene/kompilierte Frontends

// Prepare and export Express router

const feedbackRoute : Router = Router();

// The asterisk in the route means that anything after the / slash will be picked up by Express and
// exposed to the handler in Request.params[0]
// We use this to grab the article URL which is to be processed and that can be appended to this
// route without any further encoding. Most browsers are capable of that, also optional decoding
// will happen when an encoded URL is detected.
feedbackRoute.get('/*', mainHandler);

// TODO add "post" endpoint that can make use of additional query parameters, "version" most of all

export default feedbackRoute;

// Main handler, checks the URL parameter and diverts to the respective handlers

function mainHandler(requ : Request, resp : Response) : void {
	try {
		const articleURL = new ArticleURL(requ.params[0]);
		log('Feedback main router to "%s"', articleURL);

		return feedbackHandler(requ, resp, articleURL);
	}
	catch (error) {
		if (error instanceof TypeError) {
			log('URL parameter invalid');
			return paramErrorHandler(requ, resp);
		}
		else if (error instanceof EmptyError) {
			log('Empty request without parameters');
			return emptyHandler(requ, resp);
		}
	}
}
