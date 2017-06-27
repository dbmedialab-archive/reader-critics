import * as Promise from 'bluebird';

import Article from '../models/Article';

interface Parser {

	url : string;

	getArticle: () => Promise <Article>;

}

export default Parser;
