import Parser from 'base/Parser';
import Website from 'base/Website';

interface ParserService {

	getParserFor (website : Website) : Parser;

}

export default ParserService;
