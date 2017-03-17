import * as Cheerio from 'cheerio';
import axios from 'axios';
import fetchUrl from 'fetch';
import Article from '../../models/article';
import * as NodeRead from 'node-read';
import { BaseParser } from '../base';

export default class HtmlParser extends BaseParser {
	private parsedElements = {};
	private parsedArticle: {content: {}, title: {}};
	private response: {data: {}};

	public getArticle(): any {
		return new Promise((resolve, reject) => {
			// If we don't have anything to base the article on
			if (!this.requestSent || typeof this.response === 'undefined') {
				// We run the article request
				this.request().then((response) => {
					this.response = response;
					// Request was successful - carry on
					return resolve();
				}).catch(reason => {
					return reject(reason.toString());
				});
			} else {
				// We've already sent the request - carry on
				return resolve();
			}
		}).then(() => {
			this.parseArticle().then((article) => {
				return Promise.resolve(article);
			}).catch(reason => {
				// Html parsing failed
				return Promise.reject({
					success: false,
					message: 'HTML parsing failed',
					errors: [reason]
				});
			});
		}).then(article => {
			// Generate the article based on the response
			this.createArticle();

			// If we couldn't create an article
			if (!this.article) {
				// Return error
				return Promise.reject({
					success: false,
					message: 'Could not create article based on response'
				});
			}

			// Return an object containing the article
			return Promise.resolve({
				success: true,
				article: super.getArticle()
			});
		}).catch(reason => {
			// Something went wrong, return the error
			return Promise.reject({
				success: false,
				message: 'Something went wrong',
				errors: [reason]
			});
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
			modified_identifier: "unidentified"
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

		let $ = Cheerio.load(this.parsedArticle.content),
			elements = [],
			html = Cheerio.load(this.response.data),
			image = html('meta[property="og:image"]');

		// Add title and cover image (if defined)
		elements.push({type: 'h1', data: {text: this.parsedArticle.title}});
		if (typeof image !== 'undefined') {
			elements.push({type: 'img', data: {src: image.attr('content')}});
		}

		// Get the elements from the bodytext
		const $elements = $(this.elementTags.join(','));
		// Iterate through all the elements and add them to the array with the correct structure
		for(const index in $elements) {
			const data = this.getElementData($elements[index]);

			if (!data) {
				continue;
			}

			elements.push({
				type: $elements[index].name,
				data: data
			});
		}
		// Return the finished content
		return this.parsedElements = elements;
	}

	private getElementData(el) {

		// If the tag is not recognized we continue to the next element
		if (!el.hasOwnProperty('name') || this.elementTags.indexOf(el.name) == -1) {
			return false;
		}
		let $el = Cheerio.load(el);
		if (el.name === 'img') {
			return {
				src: $el.attr('src'),
				alt: $el.attr('alt')
			};
		} else {
			return {
				text: $el.text()
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
