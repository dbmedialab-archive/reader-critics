import { BaseParser } from '../base';
import * as NodeRead from 'node-read';
import * as Cheerio from 'cheerio';

class HtmlParser extends BaseParser {
	private content: Object;

	constructor(url: string) {
		super(url);
	}
	/**
	 * getContent
	 */
	public getArticle() {
		if (!this.content) {
			// new Article()
			// Run the request and then return the content within a promise
		}
	}

	// Under construction
	public request() {
		let structure = [];
		NodeRead(this.url, (err, article, res) => {
			structure.push({
				type: 'h1',
				text: article.title
			});

			let $ = Cheerio.load(article.content);
			const tags = ['p','h1','h2','h3','h4','h5','ul','img','ol'];
			let elements = $(tags.join(','));

			for(let index in elements) {
				const element = elements[index];

				if (!element.hasOwnProperty('name') || tags.indexOf(element.name) == -1) {
					continue;
				}
				structure.push({
					type: element.name,
					text: $(element).text()
				});
			}
			console.log(structure);
		});
	}
}

export { HtmlParser };
