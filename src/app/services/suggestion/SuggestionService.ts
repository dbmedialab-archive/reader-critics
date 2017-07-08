import {
	Suggestion,
} from 'base/';

interface SuggestionService {

	findSince(since : Date) : Promise <Suggestion[]>;

	save(suggestion : Suggestion) : Promise <void>;

}

export default SuggestionService;
