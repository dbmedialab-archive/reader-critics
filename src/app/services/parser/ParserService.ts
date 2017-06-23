import Parser from 'base/Parser';
import Website from 'base/Website';

interface ParserService {

	getParserFor(website : Website) : Promise <Parser>;

}

export default ParserService;
