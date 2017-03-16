import * as Cheerio from 'cheerio';
import { fetchUrl } from 'fetch';
import Article from '../../models/article';
import * as NodeRead from 'node-read';
import { BaseParser } from '../base';

class HtmlParser extends BaseParser {
	private parsedElements = {};
	private requestError = null;
	private requestSent = false;
	private response: {title: string, content: {}, html: string};

	constructor(url: string) {
		super(url);
	}

	public getArticle(): any {
		const article_promise = new Promise((resolve, reject) => {
			if (!this.article) {
				if (!this.requestSent) {
					this.request().then(() => {
						this.createArticle();
						resolve(super.getArticle());
					});
				} else {
					this.createArticle();
					resolve(super.getArticle());
				}
			} else {
				resolve(super.getArticle());
			}
		}).then(article => {
			return article;
		})

		return article_promise;
	}

	private createArticle() {
		if (!Object.keys(this.parsedElements).length) {
			this.buildElements();
		}
		const article = new Article({
			title: this.response.title,
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
			// TODO: Throw some kind of error here?
			console.error('Error: Attempted to build article elements without any data to build from.');
			return [];
		}

		let $ = Cheerio.load(this.response.content),
			elements = [],
			html = Cheerio.load(this.response.html),
			image = html('meta[property="og:image"]');

		// Add title and cover image (if defined)
		elements.push({type: 'h1', data: {text: this.response.title}});
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

	// Requests the url
	public request() {
		return new Promise((resolve, reject) => {
			fetchUrl(this.url,  (err, meta, body) => {
				this.requestSent = true;
				this.requestError = err;

				// Set the html
				let html = body.toString();

				NodeRead(html,  (err, article, res) => {
					this.response = {
						title: article.title,
						content: article.content,
						html: html
					}
					resolve(this.response);
				});
			});
		})
	}
}

export { HtmlParser };
