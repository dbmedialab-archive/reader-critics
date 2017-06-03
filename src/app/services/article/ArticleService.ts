import ArticleURL from 'base/ArticleURL';

interface ArticleService {

	getArticle(url : ArticleURL) : Promise <any>;

}

export default ArticleService;
