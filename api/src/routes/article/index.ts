import * as express from 'express';
import api from '../../apilib';
import ApiParser from '../../parser/api';
import { HtmlParser } from '../../parser/html';

const debug = api.createDebugChannel();

class ArticleRouter {

	router: express.Router;

	constructor () {
		debug('booting routes')
		this.router = express.Router();

		this.show();
		this.api();
		// This has to come last
		this.noContent();
	}

	show (): void {
		this.router.get('/', (req: express.Request, res: express.Response) => {
			const h = new HtmlParser('http://www.vg.no/nyheter/utenriks/nederland/geert-wilders-hjemby-vi-maa-gjoere-noe-med-denne-innvandringen/a/23947954/');
			res.send(h.buildContent());
		});
	}

	api (): void {
		this.router.get('/api', (req: express.Request, res: express.Response) => {
			if (typeof req.query.url === 'undefined' || req.query.url === '') {
				res.send({error: 'URL query paramater is not provided'});
				return;
			}
			const a = new ApiParser(req.query.url);
			a.request().then(article => {
				res.send(article);
				return;
			});
		});
	}

	noContent (): void {
		this.router.get('*', (req: express.Request, res: express.Response) => {
			debug('Default route handler');
			res.status(204).end();
		});
	}

}

const articleRouter = new ArticleRouter();
export default articleRouter;
