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

import * as React from 'react';

import Article from 'base/Article';
import ArticleElement from 'front/component/ArticleElement';

import { fetchArticle } from 'front/apiCommunication';
import { getArticleURL } from 'front/uiGlobals';

export interface FeedbackContainerState {
	article: Article;
}

export default class FeedbackContainer
extends React.Component <any, FeedbackContainerState> {

	constructor() {
		super();
		this.state = {
			article: null,
		};
	}

	componentWillMount() {
		const self = this;
		fetchArticle(getArticleURL(), '').then(article => self.setState({
			article,
		}));
	}

	public render() {
		// Initial state has no article data, render empty
		if (this.state.article === null) {
			return null;
		}

		// Iterate article elements and render sub components
		return <section id='content'>
			{ this.state.article.items.map(this.createArticleElement) }
		</section>;
	}

	private createArticleElement(item, index : number) {
		const elemKey = `element-${item.order.item}`;
		return <ArticleElement
			key={elemKey}
			elemOrder={item.order.item}
			typeOrder={item.order.type}

			type={item.type}
			originalText={item.text}
		/>;
	}

}
