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
			let h = new HtmlParser('http://www.vg.no/nyheter/utenriks/nederland/geert-wilders-hjemby-vi-maa-gjoere-noe-med-denne-innvandringen/a/23947954/');
			res.send(h.buildContent());
		});
	}

	api (): void {
		this.router.get('/api', (req: express.Request, res: express.Response) => {
			const a = new ApiParser('http://www.dagbladet.no/_dan/berge.json');
			res.send(a.request());
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
