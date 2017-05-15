import * as express from 'express';
import * as path from 'path';

import * as app from 'util/applib';

const router = express.Router();

router.use('/images', express.static(path.join(app.rootPath, 'tmp/images')));
router.use('/styles', express.static(path.join(app.rootPath, 'tmp/styles')));

// We don't bundle frontend libraries together with the compiled sources, but rather host
// them from static endpoints. Fair tradeoff between enabled browser caching but not using
// a CDN for those libs and being able to upgrade them easily through NPM or Yarn locally.
router.use('/react', express.static(path.join(app.rootPath, 'node_modules/react/dist/')));
router.use('/react', express.static(path.join(app.rootPath, 'node_modules/react-dom/dist/')));

router.use('/', express.static(path.join(app.rootPath, 'out/front')));

export default router;
