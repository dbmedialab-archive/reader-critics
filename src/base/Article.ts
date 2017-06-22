import ArticleAuthor from './ArticleAuthor';
import ArticleItem from './ArticleItem';
import ArticleURL from './ArticleURL';

export interface Article {

	// Defining a unique version of one article
	url : ArticleURL;
	version : string;

	// Byline
	authors : ArticleAuthor[];

	// Contents - Title, subtitle, everything is picked up as an item
	items : ArticleItem[];

}

export default Article;
