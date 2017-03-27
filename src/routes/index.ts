import * as debug from 'debug';
import * as express from 'express';
import api from './api';

const router: express.Router = express.Router();

router.use('/api', api);

router.use('*', (req, res) => {
	debug('Default route handler');
	res.status(204).end();
});

export default router;
