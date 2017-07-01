import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';

interface ParserFactory {
	newInstance(rawArticle : string, articleURL : ArticleURL) : Parser;
}

export default ParserFactory;
