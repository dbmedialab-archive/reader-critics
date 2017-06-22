import Article from 'base/Article';

interface Parser {

	parse(rawHTML : string) : Promise <Article>;

}

export default Parser;
