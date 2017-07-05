import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';

interface ParserFactory {
	newInstance(rawArticle : string, articleURL : ArticleURL) : Parser;
}

export default ParserFactory;

export const createFactory = (constructorFn : Function) : ParserFactory => ({
	newInstance: (...arghs) : Parser => new (
		Function.prototype.bind.call(constructorFn, null, ...arghs)
	)(),
});
