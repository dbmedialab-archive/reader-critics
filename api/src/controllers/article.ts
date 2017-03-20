import * as express from 'express';
import api from '../apilib';
import ApiParser from '../parser/api';
import { HtmlParser } from '../parser/html';

const debug = api.createDebugChannel();

export default class ArticleController {
	public static index(req: express.Request, res: express.Response) : void {
		res.send('hellu');
	}

	public static show(req: express.Request, res: express.Response): void {
		const h = new HtmlParser('http://www.vg.no/nyheter/utenriks/nederland/geert-wilders-hjemby-vi-maa-gjoere-noe-med-denne-innvandringen/a/23947954/');
		res.send(h.buildContent());
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
