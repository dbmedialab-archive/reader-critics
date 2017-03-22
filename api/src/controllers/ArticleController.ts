import * as express from 'express';
import api from '../apilib';
import ApiParser from '../parser/api/ApiParser';
import HtmlParser from '../parser/html/HtmlParser';

const debug = api.createDebugChannel();

export default class ArticleController {
	public static index(req: express.Request, res: express.Response) : void {
		res.send('hellu');
	}

	public static html(req: express.Request, res: express.Response): void {
		const h = new HtmlParser(req.query.url);
		h.getArticle()
		.then(article => res.send(article))
		.catch(reason => res.send(reason));
	}

	public static api(req: express.Request, res: express.Response): void {
		if (typeof req.query.url === 'undefined' || req.query.url === '') {
			res.send({ error: 'URL query paramater is not provided' });
			return;
		}
		const a = new ApiParser(req.query.url);
		a.request().then(article => {
			res.send(article);
			return;
		}).catch(reason => {
			console.error(reason);
			return;
		});
	}

	public static noContent(req: express.Request, res: express.Response): void {
		debug('Default route handler');
		res.status(204).end();
	}
}
