import * as Ajv from 'ajv';
import * as Http from 'http';

import { Article } from '../../models/article';
import { BaseParser } from '../base';
import { Schema } from './json';

class ApiParser extends BaseParser {
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
		console.log('articleJson', articleJson);
	}
}

export { ApiParser };
