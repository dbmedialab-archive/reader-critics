import * as express from 'express';
import ArticleController from '../controllers/ArticleController';

const router = express.Router();

router.get('/', ArticleController.index);
router.get('/api', ArticleController.api);
router.get('/html', ArticleController.html);

export default router;
