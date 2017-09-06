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
import MainStore from 'admin/stores/MainStore';
import Api from 'admin/services/Api';
import * as ArticlesActions from './ArticlesActions';
import * as ArticlesActionsCreator from 'admin/actions/ArticlesActionsCreator';

export function setArticleList(articles: Array<Article>) {
	MainStore.dispatch(
		ArticlesActionsCreator.setArticleList(articles)
	);
}

export function getArticleList() {
	Api.getArticleList()
	.then((resp)=>{
		ArticlesActions.setArticleList(resp);
	});
}
