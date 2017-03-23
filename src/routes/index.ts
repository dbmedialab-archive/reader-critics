import * as debug from 'debug';
import * as express from 'express';
import article from './article';

const router: express.Router = express.Router();

router.use('/article', article);

router.use('*', (req, res) => {
	debug('Default route handler');
	res.status(204).end();
});

export default router;
