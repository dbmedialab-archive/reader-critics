import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

interface WebsiteService {

	identify(url : ArticleURL|string) : Website;

}

export default WebsiteService;
