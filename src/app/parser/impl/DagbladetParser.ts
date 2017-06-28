import Article from 'base/Article';
import Parser from 'base/Parser';

export default class DagbladetParser implements Parser {

	parse(rawHTML : string) : Promise <Article> {
		return Promise.resolve(null);
	}

}
