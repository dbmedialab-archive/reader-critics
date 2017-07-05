import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';

interface Parser {
	parse() : Promise <Article>;
}

export default Parser;

export type ParserConstructor = {
	new(rawArticle : string, url : ArticleURL) : Parser,
};
