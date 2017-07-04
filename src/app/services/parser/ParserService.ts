import Parser from 'base/Parser';
import ParserFactory from 'base/ParserFactory';
import Website from 'base/Website';

interface ParserService {
	getParserFor(website : Website) : Promise <ParserFactory>;
}

export default ParserService;
