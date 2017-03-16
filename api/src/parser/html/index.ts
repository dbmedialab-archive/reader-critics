import * as Cheerio from 'cheerio';
import * as NodeRead from 'node-read';
import { BaseParser } from '../base';

class HtmlParser extends BaseParser {
	private parsedContent = {};
	private requestError = null;
	private requestSent = false;
	private response: {title: string, content: {}};

	constructor(url: string) {
		super(url);
	}

	public getArticle() {
		if (!Object.keys(this.parsedContent).length) {
			this.buildContent();
			// new Article()
		}
		return super.getArticle();
	}

	public buildContent() {
		// If we already have the parsed content
		if (Object.keys(this.parsedContent).length) {
			// We just return it
			return this.parsedContent;

		// If the article has not yet been requested
		} else if(!this.requestSent) {
			// We send the request and attempt to build the content after
			this.request(() => {
				this.buildContent();
			});
			return;

		// If the article has been requested but no response was returned or if we have an error
		} else if (this.requestError !== null || !Object.keys(this.response).length) {
			// @TODO: Throw some kind of error here, or attempt multiple times to request the article(?)
			console.error('Request for the article failed, heres an error: ', this.requestError);
			return;
		}
			const $ = Cheerio.load(this.response.content),
			elements = [];

		elements.push({
			type: 'h1',
			text: this.response.title
		});

		const $elements = $(this.elementTags.join(','));
		let curr_element: {name: string};

		// Iterate through all the elements and add them to the array with the correct structure
		for(const index in $elements) {
			curr_element = $elements[index];

			// If the tag is not recognized we continue to the next element
			if (!curr_element.hasOwnProperty('name') || this.elementTags.indexOf(curr_element.name) == -1) {
				continue;
			}

			elements.push({
				type: curr_element.name,
				text: $(curr_element).text()
			});
		}

		console.log(elements);
	}

	// Requests the url
	public request(callback?: () => void) {
		NodeRead(this.url, (err, article, res) => {
			this.requestSent = true;
			this.requestError = err;
			this.response = article;

			// Execute the callback
			if (typeof callback !== 'undefined') {
				callback();
			}
		});
	}
}

export { HtmlParser };
