import * as debug from 'debug';
import * as express from 'express';
import * as path from 'path';

import article from './article';

const router: express.Router = express.Router();

// frontend
router.get('/', (req, res) => {
	res.sendFile('index.html', { root: 'src/frontend/views' });
});

// api
router.use('/article', article);

router.use('*', (req, res) => {
	debug('Default route handler');
	res.status(204).end();
});

export default router;
