import * as path from 'path';

import {
	Router,
	static as serveStatic,
} from 'express';

import * as app from 'app/util/applib';

const staticRoute : Router = Router();

//express.s

staticRoute.use('/images', serveStatic(path.join(app.rootPath, 'tmp/images')));
staticRoute.use('/styles', serveStatic(path.join(app.rootPath, 'tmp/styles')));

// We don't bundle frontend libraries together with the compiled sources, but rather host
// them from static endpoints. Fair tradeoff between enabled browser caching but not using
// a CDN for those libs and being able to upgrade them easily through NPM or Yarn locally.
staticRoute.use('/react', serveStatic(path.join(app.rootPath, 'node_modules/react/dist/')));
staticRoute.use('/react', serveStatic(path.join(app.rootPath, 'node_modules/react-dom/dist/')));

staticRoute.use('/', serveStatic(path.join(app.rootPath, 'out/front')));

export default staticRoute;
