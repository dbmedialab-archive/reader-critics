//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import * as Cheerio from 'cheerio';

import ArticleAuthor from 'base/ArticleAuthor';

import GenericParser from './GenericParser';

import { getOpenGraphAuthors } from '../util/AuthorParser';
import { getOpenGraphModifiedTime } from '../util/VersionParser';

import * as app from 'app/util/applib';

const log = app.createLog();

export default class DagbladetParser extends GenericParser {

	protected select : Cheerio;

	protected initialize() : Promise <any> {
		log('initialize');
		return super.initialize();
		// return CheerioPlugin.create(this.rawArticle)
		// 	.then((s : Cheerio) => this.select = s);
	}

	protected parseVersion() : Promise <string> {
		const version = getOpenGraphModifiedTime(this.select);
		log('parsing version:', version);
		return Promise.resolve(version);
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		const authors = getOpenGraphAuthors(this.select);
		log('parsing byline:', authors);
		return Promise.resolve(authors);
	}

	// protected parseTitles() : Promise <ArticleItem[]> {
	// 	return Promise.resolve([]);
	// } TODO

	// protected parseContent() : Promise <ArticleItem[]> {
	// 	return Promise.resolve([]);
	// } TODO

}
