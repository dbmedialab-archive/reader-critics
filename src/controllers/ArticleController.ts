import * as express from 'express';
import api from '../apilib';
import config from '../config';

import ApiParser from '../parser/api/ApiParser';
import HtmlParser from '../parser/html/HtmlParser';

const debug = api.createDebugChannel();

export default class ArticleController {

	public static parse(req: express.Request, res: express.Response) {
		// TODO: Read site config from the database here and cache it
		const parseConfig = {};
		if (!Object.keys(parseConfig).length) {
			// No config has been found, fallback to default
			switch (config.get('parser.fallback')) {
				case 'api':
					ArticleController.api(req, res);
					return;
				default:
					ArticleController.html(req, res);
					return;
			}
		}
	}

	private static html(req: express.Request, res: express.Response): void {
		const h = new HtmlParser(req.query.url);
		h.getArticle()
		.then(article => res.send(article))
		.catch(reason => res.send(reason));
	}

	private static api(req: express.Request, res: express.Response): void {
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
			res.send(reason);
			return;
		});
	}
}
