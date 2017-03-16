import * as Cheerio from 'cheerio';
import { fetchUrl } from 'fetch';
import Article from '../../models/article';
import * as NodeRead from 'node-read';
import { BaseParser } from '../base';
import ParserRequestException from '../../exceptions/ParserRequestException';

class HtmlParser extends BaseParser {
	private parsedElements = {};
	private requestError = null;
	private requestSent = false;
	private response: {title: string, content: {}, html: string, status: number};

	public getArticle(): any {
		return new Promise((resolve, reject) => {
			// If we don't have anything to base the article on
			if (!this.requestSent || typeof this.response === 'undefined') {
				// We run the article request
				this.request().then(() => {
					// If the request failed
					if (this.requestError || typeof this.response === 'undefined' || this.response.status !== 200) {
						// We throw an exception
						reject(new ParserRequestException('Failed to request the article HTML'));
					}
					// Request was successful - carry on
					resolve();
				});
			} else {
				// We've already sent the request and have the data - carry on
				resolve();
			}
		}).then(() => {
			// Generate the article based on the response
			this.createArticle();

			// If we couldn't create an article
			if (!this.article) {
				// Return error
				return {
					success: false,
					exception: new ParserRequestException('Could not create article based on response')
				};
			}

			// Return an object containing the article
			return {
				success: true,
				data: super.getArticle()
			};
		}).catch(reason => {
			// Something went wrong, return the error
			return {
				success: false,
				exception: reason
			};
		});
	}

	private createArticle() {
		// Check if we have built the elements of the article
		if (!Object.keys(this.parsedElements).length) {
			this.buildElements();
		}

		// Build an article object based on the data
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
						html: html,
						status: meta.status
					}
					resolve(this.response);
				});
			});
		})
	}
}

export { HtmlParser };
