import Article from '../models/article';

export interface Parser {
	// Properties
	url: string;

	// Methods
	// request: () => void;
	getArticle: () => Article;
}
