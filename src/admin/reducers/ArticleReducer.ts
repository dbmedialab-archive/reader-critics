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

import * as Immutable from 'seamless-immutable';
import * as  ArticleActionsCreator  from 'admin/actions/ArticleActionsCreator';
import AdminConstants from 'admin/constants/AdminConstants';
import Article from 'base/Article';
import Feedback from 'base/Feedback';

export interface IArticleState {
	article: Article;
	feedbacks: Array<Feedback>;
}

const initialState: IArticleState = Immutable({
	article: {},
	feedbacks: [],
});

function setArticle(action, state) {
	return state.merge({
		article: action.payload || {},
	});
}

function setFeedbacks(action, state) {
	return state.merge({
		feedbacks: action.payload || [],
	});
}

function clear(action, payload) {
	return initialState;
}

function ArticleReducer(
	state: IArticleState = initialState,
	action: ArticleActionsCreator.TAction
	): IArticleState {

	switch (action.type) {
		case AdminConstants.ARTICLE_RECEIVED:
			return setArticle(action, state);
		case AdminConstants.ARTICLE_FEEDBACKS_RECEIVED:
			return setFeedbacks(action, state);
		case AdminConstants.ARTICLE_CLEAR:
			return clear(action, state);
		default:
			return state;
	}
}

export default ArticleReducer;
