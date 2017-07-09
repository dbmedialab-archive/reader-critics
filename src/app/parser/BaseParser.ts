import * as Bluebird from 'bluebird';

import {
	Article,
	ArticleAuthor,
	ArticleItem,
	ArticleURL,
	Parser,
} from 'base';

import BaseElements from './BaseElements';

interface ParserWorkflowPayload {
	version : any;
	authors : any;
	titles : any;
	featured : any;
	content : any;
}

abstract class BaseParser extends BaseElements implements Parser {

	constructor(
		protected readonly rawArticle : string,
		protected readonly articleURL : ArticleURL
	) {
		super();
	}

	parse() : Promise <Article> {
		return this.initialize().then(() => this.parseArticle());
	}

	/**
	 * Parser initialization. Override this with your own code if you need
	 * some asynchronous bootstrap functions to run before the parser will
	 * be ready. Don't forget to return a Promise! (void return value)
	 */
	protected initialize() : Promise <any> {
		return Promise.resolve();
	}

	/**
	 * Parser workflow. Taken out of parse() for readability.
	 */
	private parseArticle() : Promise <Article> {
		const workflow : ParserWorkflowPayload = {
			version: this.parseVersion(),
			authors: this.parseByline(),
			titles: this.parseTitles(),
			featured: this.parseFeaturedImage(),
			content: this.parseContent(),
		};

		return Promise.resolve(Bluebird.props(workflow))
		.then((a : ParserWorkflowPayload) : Article => ({
			url: this.articleURL,
			version: a.version,
			authors: a.authors,
			items: [
				...a.titles,
				...a.featured,
				...a.content,
			],
		}));
	}

	// Prototypes

	protected abstract parseVersion() : Promise <string>;
	protected abstract parseByline() : Promise <ArticleAuthor[]>;
	protected abstract parseTitles() : Promise <ArticleItem[]>;
	protected abstract parseFeaturedImage() : Promise <ArticleItem[]>;
	protected abstract parseContent() : Promise <ArticleItem[]>;

}

export default BaseParser;
