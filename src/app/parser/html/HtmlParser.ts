import * as Cheerio from 'cheerio';
import * as NodeRead from 'node-read';
import * as Promise from 'bluebird';

import Article from 'app/models/Article';
import BaseParser from '../BaseParser';

export default class HtmlParser extends BaseParser {
	private parsedElements = {};
	private parsedArticle: {content: {}, title: {}};
	private response: {data: {}};

	public getArticle(): Promise <Article> {
		return new Promise((resolve, reject) => {
			// If we don't have anything to base the article on
			if (!this.requestSent || typeof this.response === 'undefined') {
				// We run the article request
				return this.request().then((response) => {
					this.response = response;
					// Request was successful - carry on
					return resolve();
				})
				.catch(reason => reject(reason));
			}
			else {
				// We've already sent the request - carry on
				return resolve();
			}
		}).then(() => {
			return this.parseArticle().then((article) => {
				return Promise.resolve(article);
			}).catch(reason => {
				// Html parsing failed
				return Promise.reject({
					success: false,
					message: 'HTML parsing failed',
					errors: [reason],
				});
			});
		}).then((article : any) => {
			// Generate the article based on the response
			this.createArticle();

			// If we couldn't create an article
			if (!this.article) {
				// Return error
// TODO exchange this with throwing a dedicated error class. The parser should not form API responses
				return Promise.reject({
					success: false,
					message: 'Could not create article based on response',
				});
			}

			// Return an object containing the article
			return Promise.resolve(super.getArticle());
		});
	}

	private createArticle() {
		// Check if we have built the elements of the article
		if (!Object.keys(this.parsedElements).length) {
			this.buildElements();
		}

		// Build an article object based on the data
		const article = new Article({
			title: this.parsedArticle.title,
			elements: this.parsedElements,
			url: this.url,
			modified_identifier: 'unidentified',
		});
		if (article) {
			this.article = article;
		}
	}

	private buildElements() {
		// If we already have the parsed content
		if (Object.keys(this.parsedElements).length) {
			// We just return it
			return this.parsedElements;
		// If the build function was initiated without having a response
		} else if (!Object.keys(this.response).length) {
			console.error('Error: Attempted to build article elements without any data to build from.');
			return [];
		}

		const $ = Cheerio.load(this.parsedArticle.content),
			elements = [],
			html = Cheerio.load(this.response.data),
			image = html('meta[property="og:image"]');
		let elCounter = 1;

		// Add title and cover image (if defined)
		elements.push({
			type: 'h1',
			data: {
				text: this.parsedArticle.title,
			},
			order: elCounter++,
		});

		if (typeof image !== 'undefined') {
			elements.push({type: 'img', data: {src: image.attr('content')}, order: elCounter++});
		}

		// Get the elements from the bodytext
		const $elements = $(this.elementTags.join(','));
		// Iterate through all the elements and add them to the array with the correct structure
		for (const index in $elements) {
			const data = this.getElementData($elements[index]);

			if (!data) {
				continue;
			}

			elements.push({
				type: $elements[index].name,
				data: data,
				order: elCounter++,
			});
		}
		// Return the finished content
		return this.parsedElements = elements;
	}

	private getElementData(el) {

		// If the tag is not recognized we continue to the next element
		if (!el.hasOwnProperty('name') || this.elementTags.indexOf(el.name) === -1) {
			return false;
		}
		const $el = Cheerio.load(el);
		if (el.name === 'img') {
			return {
				src: el.attribs.src,
				alt: el.attribs.alt,
			};
		} else if (el.name === 'a') {
			return {
				href: el.attribs.href,
				text: $el.text().trim(),
			};
		} else {
			return {
				text: $el.text().trim(),
			};
		}
	}

	private parseArticle() {
		return new Promise((resolve, reject) => {
			NodeRead(this.response.data, (err, article, res) => {
				if (err) {
					return reject(err);
				}
				this.parsedArticle = article;
				return resolve(article);
			});
		});
	}
}
