import * as express from 'express';
import ArticleController from '../controllers/ArticleController';

const router = express.Router();

router.get('/parse', ArticleController.parse);

export default router;
