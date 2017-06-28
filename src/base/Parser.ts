import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';

interface Parser {

	parse(rawHTML : string, url : ArticleURL) : Promise <Article>;

}

export default Parser;
