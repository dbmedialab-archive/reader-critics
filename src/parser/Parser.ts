import Article from '../models/article';

interface Parser {
	// Properties
	url: string;

	// Methods
	// request: () => void;
	getArticle: () => Article;
}

export default Parser;
