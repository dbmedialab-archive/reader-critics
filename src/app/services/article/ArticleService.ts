import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';

interface ArticleService {

	getArticle(url : ArticleURL) : Promise <Article>;

}

export default ArticleService;
