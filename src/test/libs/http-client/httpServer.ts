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

import {
	Express,
	Request,
	Response,
} from 'express';

import { Server } from 'http';

// Define test routes

const expressApp : Express = express();

let server : Server;

expressApp.get('/not-found', (requ : Request, resp : Response) => {
	resp.status(404).end('Not found');
});

expressApp.get('/crash-me', (requ : Request, resp : Response) => {
	resp.status(500).end('Well, shit!');
});

expressApp.get('/', (requ : Request, resp : Response) => {
	resp.status(200).end('OK');
});

// Expose interface to test

export function listen(port : number, callback : () => void) {
	server = expressApp.listen(port, callback);
}

export function close(callback : () => void) {
	server.close(callback);
}
