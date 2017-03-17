import * as Ajv from 'ajv';
import * as Http from 'http';

import Article from '../../models/article';
import Author from '../../models/author';
import Site from '../../models/site';
import Tag from '../../models/tag';
import { BaseParser } from '../base';
import { Schema } from './json';

export default class ApiParser extends BaseParser {
	constructor(url: string) {
		super(url);
	}

	/*
	* Fetch json from the given api url provided by the site
	*/
	public request(): any {
		return new Promise((resolve, reject) => {
			if (!this.url) {
				reject({
					success: false,
					message: 'No url provided',
				});
			}

			Http.get(this.url, (res) => {
				let data = '';

				res.on('data', (chunk) => {
					data += chunk.toString();
				});
				res.on('end', () => {
					// Validate the json schema recieveed
					const articleJson = JSON.parse(data);
					const ajv = new Ajv();

					// See schema in json.ts
					const validate = ajv.compile(Schema);
					const valid = validate(articleJson);

					if (!valid) {
						console.error(validate.errors);
						reject({
							success: false,
							message: 'Failed to validate the json schema.',
							errors: validate.errors,
						});
						return;
					}
					const article = this.buildArticle(articleJson);
					resolve(article.getArticle());
				});
				res.on('error', (error) => {
					console.error('error', error);
					reject(error);
				});

			});
		}).then(article => {
			return {
				success: true,
				article,
			};
		}).catch(reason => {
			console.error('Catching rejection error: ', reason);
			return reason;
		});
	}

	private buildArticle(articleJson: object) {
		const site = new Site(articleJson['site']);
		const article = new Article(articleJson['article']);

		const authors = [];
		for (const author of articleJson['byline']) {
			authors.push(new Author(author));
		}

		const tags = [];
		for (const tag of articleJson['tags']) {
			tags.push(new Tag(tag));
		}

		// TODO: Do something with site, authors and tags
		return article;
	}
}
