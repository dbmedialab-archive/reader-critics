import Article from '../models/Article';

interface Parser {
	// Properties
	url: string;

	// Methods
	// request: () => void;
	getArticle: () => Article;
}

export default Parser;
