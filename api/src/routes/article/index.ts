import * as express from 'express';

import api from '../../apilib';

const debug = api.createDebugChannel();

const serveNoContent = (requ, resp) => {
	debug('Default route handler');
	resp.status(204).end();
};

// Routing
const articleHandler = express();

articleHandler.get('*', serveNoContent);

export default articleHandler;
