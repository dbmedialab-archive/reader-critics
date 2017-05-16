import * as path from 'path';

import {
	Router,
	static as serveStatic,
} from 'express';

import * as app from 'util/applib';

const router : Router = Router();

//express.s

router.use('/images', serveStatic(path.join(app.rootPath, 'tmp/images')));
router.use('/styles', serveStatic(path.join(app.rootPath, 'tmp/styles')));

// We don't bundle frontend libraries together with the compiled sources, but rather host
// them from static endpoints. Fair tradeoff between enabled browser caching but not using
// a CDN for those libs and being able to upgrade them easily through NPM or Yarn locally.
router.use('/react', serveStatic(path.join(app.rootPath, 'node_modules/react/dist/')));
router.use('/react', serveStatic(path.join(app.rootPath, 'node_modules/react-dom/dist/')));

router.use('/', serveStatic(path.join(app.rootPath, 'out/front')));

export default router;
