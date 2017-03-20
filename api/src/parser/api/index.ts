import * as Ajv from 'ajv';
import axios from 'axios';
import * as Http from 'http';

import Article from '../../models/article';
import Author from '../../models/author';
import Byline from '../../models/byline';
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
		if (!this.url) {
			return Promise.reject({
				success: false,
				message: 'No url provided',
			});
		}

		return axios.get(this.url).then(response => {
			let articleJson = {};
			if (response.headers['content-type'].indexOf('json') === -1) {
				if (typeof response.data === 'string') {
					try {
						articleJson = JSON.parse(response.data);
					} catch (error) {
						return Promise.reject({
							success: false,
							message: 'Could not parse json',
						});
					}
				}
			} else {
				articleJson = response.data;
			}
			// json validator
			const ajv = new Ajv();

			// See schema in json.ts
			const validate = ajv.compile(Schema);
			const valid = validate(articleJson);

			if (!valid) {
				console.error(validate.errors);
				return Promise.reject({
					success: false,
					message: 'Failed to validate the json schema.',
					errors: validate.errors,
				});
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
