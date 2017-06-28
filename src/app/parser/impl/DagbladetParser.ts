import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import Parser from 'base/Parser';

import GenericParser from './GenericParser';

import { getOpenGraphAuthors } from '../util/AuthorParser';
import { getOpenGraphModifiedTime } from '../util/VersionParser';

export default class DagbladetParser extends GenericParser {

	protected parseVersion() : Promise <string> {
		return Promise.resolve(getOpenGraphModifiedTime(this.select));
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		return Promise.resolve(getOpenGraphAuthors(this.select));
	}

}
