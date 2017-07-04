import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

interface ArticleService {

	download(url : ArticleURL) : Promise <string>;
	fetch(website : Website, url : ArticleURL) : Promise <Article>;

	load(url : ArticleURL, version : string) : Promise <Article>;
	save(website : Website, article : Article) : Promise <void>;

}

export default ArticleService;
