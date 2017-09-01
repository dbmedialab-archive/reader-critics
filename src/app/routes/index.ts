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

import * as express from 'express';

import { Application, Request, Response } from 'express';
import { parse } from 'url';

import * as session from 'express-session';
import * as passport from 'passport';

import {
	deserializeUser,
	localStrategy,
	serializeUser,
} from 'app/middleware/config/passportConfig';

import adminRoute from './admin/adminRoute';
import adminApiRoute from './admin/api/adminApiRoute';
import apiRoute from './apiRoute';
import faviconRoute from './faviconRoute';
import fakeWidgetRoute from './fakeWidgetRoute';
import feedbackRoute from './feedbackRoute';
import homeRoute from './homeRoute';
import staticRoute from './staticRoute';
import suggestionRoute from './suggestionRoute';

import {
	catchAllErrorHandler,
	notFoundHandler,
} from './errorHandlers';

import { sessionConf } from 'app/middleware/config/sessionConfig';

import * as app from 'app/util/applib';

const log = app.createLog();

// Main

export default function(expressApp : Application) {
	if (!app.isProduction) {
		expressApp.use(logRequest);
	}

	expressApp.use(session(sessionConf));

	// Passport init
	passport.use(localStrategy);
	passport.serializeUser(serializeUser);
	passport.deserializeUser(deserializeUser);

	expressApp.use(passport.initialize());
	expressApp.use(passport.session());

	setOptions(expressApp);
	setRoutes(expressApp);
	setErrorHandlers(expressApp);
}

// Express routes

function setRoutes(expressApp : express.Application) {
	log('Setting Express routes');

	expressApp.use(faviconRoute);

	expressApp.use('/static', staticRoute);

	expressApp.use('/api', apiRoute);
	expressApp.use('/fake-widget', fakeWidgetRoute);
	expressApp.use('/fb', feedbackRoute);
	expressApp.use('/suggestion-box', suggestionRoute);
	expressApp.use('/admin/api', adminApiRoute);
	expressApp.use('/admin', adminRoute);

	expressApp.use('/', homeRoute);

	expressApp.use(notFoundHandler);
}

// Express application options

function setOptions(expressApp : express.Application) {
	log('Setting Express options');

	expressApp.set('view', undefined);
	expressApp.set('views', undefined);

	expressApp.set('x-powered-by', false);
}

// Express error handlers

function setErrorHandlers(expressApp : express.Application) {
	expressApp.use(catchAllErrorHandler);
}

// Log all express requests

function logRequest(requ : Request, resp: Response, next : Function) {
	const url = parse(requ.url);

	if (url.query === null) {
		log(url.pathname);
	}
	else {
		log(url.pathname, requ.query);
	}

	next();
}
