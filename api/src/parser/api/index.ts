import * as Ajv from 'ajv';
import * as Http from 'http';

import Article from '../../models/article';
import Author from '../../models/author';
import Site from '../../models/site';
import { BaseParser } from '../base';
import { Schema } from './json';

export default class ApiParser extends BaseParser {
	constructor(url: string) {
		super(url);
	}

	public request() {
		if (!this.url) {
			return;
		}

		Http.get(this.url, (res) => {
			let data = '';

			res.on('data', (chunk) => {
				data += chunk.toString();
			});
			res.on('end', () => {
				const articleJson = JSON.parse(data);
				const ajv = new Ajv();
				const validate = ajv.compile(Schema);
				const valid = validate(articleJson);

				if (!valid) {
					// @TODO: return some error to the user
					console.log(validate.errors);
				} else {
					this.buildArticle(articleJson);
				}
			});
			res.on('error', (error) => {
				// @TODO: return some error to the user
				console.log('error', error);
			});

		});
	}

	private buildArticle(articleJson: object) {
		const site = new Site(articleJson['site']);
		const article = new Article(articleJson['article']);
		const authors = articleJson['byline'];
		const tags = articleJson['tags'];
	}
}
