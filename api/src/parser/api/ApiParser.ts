import * as Ajv from 'ajv';
import axios from 'axios';
import * as Http from 'http';

import Article from '../../models/Article';
import Author from '../../models/Author';
import Byline from '../../models/Byline';
import Error from '../../models/Error';
import Site from '../../models/Site';
import Tag from '../../models/Tag';
import BaseParser from '../BaseParser';
import Schema from './Schema';

export default class ApiParser extends BaseParser {
	constructor(url: string) {
		super(url);
	}

	/*
	* Fetch json from the given api url provided by the site
	*/
	public request(): any {
		if (!this.url) {
			return Promise.reject(new Error(false, 'No url provided'));
		}

		return axios.get(this.url).then(response => {
			let articleJson = {};
			if (response.headers['content-type'].indexOf('json') === -1) {
				if (typeof response.data === 'string') {
					try {
						articleJson = JSON.parse(response.data);
					} catch (error) {
						return Promise.reject(new Error(false, 'Could not parse json'));
					}
				}
			} else {
				articleJson = response.data;
			}
			// json validator
			const ajv = new Ajv();

			// See schema in json.ts
			const validate: Ajv.ValidateFunction = ajv.compile(Schema);
			const valid: any = validate(articleJson);

			if (!valid) {
				console.error(validate.errors);
				return Promise.reject(new Error(false, 'Failed to validate the json schema', validate.errors));
			}

			const article = this.buildArticle(articleJson);
			return Promise.resolve({
				success: true,
				article: article.getArticle(),
			}).catch(reason => {
				return Promise.reject(reason);
			});
		});
	}

	private buildArticle(articleJson: object) {
		const site = new Site(articleJson['site']);
		const article = new Article(articleJson['article']);

		const byline = new Byline({});
		for (const author of articleJson['byline']) {
			byline.attachdAuthor(new Author(author).toString());
		}
		article.setByline(byline.toString());

		for (const tag of articleJson['tags']) {
			article.attachTag(new Tag(tag).toString());
		}

		return article;
	}
}
