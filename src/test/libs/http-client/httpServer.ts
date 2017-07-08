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

export function listen(port : number, callback : Function) {
	server = expressApp.listen(port, callback);
}

export function close(callback : Function) {
	server.close(callback);
}
