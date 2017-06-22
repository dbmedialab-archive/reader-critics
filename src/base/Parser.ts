import Article from 'base/Article';

interface Parser {

	parse(rawHTML : string) : Article;

}

export default Parser;
