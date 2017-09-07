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

import Article from 'base/Article';
import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

import BasicPersistingService from '../BasicPersistingService';
import {ArticleDocument} from 'app/db/models';
import {ObjectID} from 'bson';

/**
 * The Article Service persists Article objects to the database and keeps
 * references to the relevant Website and User objects.
 *
 * Website: the article belongs to a site where it was downloaded from, this
 * site has to exist in our database and will be referenced to the new object.
 *
 * User: each article has a byline with one or more authors, consisting of pairs
 * or "name" and "email" strings. To query articles written by a certain person
 * or find out the right person to send an e-mail to if feedback was produced,
 * article authors will be mapped to User objects in the database.
 *
 * The database schema uses a unique constraint for identifying articles which
 * consists of the article "url" and "version" strings.
 *
 * Since articles never need to be updated, this service has no functions for
 * doing that. However, they might get deleted from the database at some point,
 * if no feedback references to this article/version exist.
 * (For example: a user opens the feedback page, article gets parsed and stored;
 * then the user closes the browser without send feedback)
 */

interface ArticleService extends BasicPersistingService <Article> {
	/**
	 * Fetch the raw article data from a remote source. It is returned as a string
	 * and indended to be validated and processed through a parser.
	 *
	 * @throws EmptyError If one of the mandatory parameters is missing.
	 */
	download(url : ArticleURL) : Promise <string>;

	/**
	 * Fetch uses #download() first to get the raw article data from the remote
	 * source and at the same time, requests a new parser instance from the
	 * ParserService. The parser implementation is controlled by the Website
	 * setting. Afterwards, the raw article is parsed and returned.
	 *
	 * @throws EmptyError If one of the mandatory parameters is missing.
	 */
	fetch(website : Website, url : ArticleURL) : Promise <Article>;

	/**
	 * Query one article from the database, use the two properties "url" and
	 * "version" which uniquely identify an object in the database collection.
	 *
	 * @throws EmptyError If one of the mandatory parameters is missing.
	 */
	get(url : ArticleURL, version : string, populated? : boolean) : Promise <Article>;

	/**
	 * Save a new Article object to the database and reference it with its origin
	 * Website. The "authors" array in the Article will be taken and users for
	 * these authors will be created, should they not already exist, and then
	 * referenced.
	 *
	 * @throws EmptyError If one of the mandatory parameters is missing.
	 * @throws DuplicateError If that Article already exists (unique constraint)
	 */
	save(website : Website, article : Article) : Promise <Article>;

	/**
	 * Does the same as save() but uses find+update with an upsert flag in the
	 * query. Existing articles will not be overwritten but rather ignored, so
	 * no DuplicateError is thrown.
	 *
	 * @throws EmptyError If one of the mandatory parameters is missing.
	 */
	upsert(website : Website, article : Article) : Promise <Article>

	getRangeWithFBCount(skip: number,
			limit: number,
			sort: Object): Promise <ArticleDocument[]>

	/**
	 * Get an Article by it's ID
	 *
	 * @throws EmptyError if ID not set
	 */
	getByID(ID : ObjectID) : Promise <Article>

	/**
	 * Get amount of Articles
	 */
	getAmount() : Promise <number>
}

export default ArticleService;
