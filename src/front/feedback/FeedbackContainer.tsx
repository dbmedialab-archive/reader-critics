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
import 'front/scss/fb.scss';

import Article from 'base/Article';
import FeedbackItem from 'base/FeedbackItem';

import createArticleElement from 'front/component/createArticleElement';
import { ArticleElement } from 'front/component/ArticleElement';

import FinishButton from 'front/feedback/FinishButton';
import PostFeedbackContainer from 'front/feedback/PostFeedbackContainer';

import { fetchArticle } from 'front/apiCommunication';

import {
	getArticleURL,
	getArticleVersion,
} from 'front/uiGlobals';

export interface FeedbackContainerState {
	article: Article;
	articleItems: Array<FeedbackItem>;
	isFeedbackReady: boolean;
}

export default class FeedbackContainer
extends React.Component <any, FeedbackContainerState> {

	private articleElements : ArticleElement[] = [];

	constructor() {
		super();
		this.state = {
			article: null,
			isFeedbackReady: false,
			articleItems: [],
		};
	}

	componentWillMount() {
		const self = this;
		fetchArticle(getArticleURL(), getArticleVersion()).then(article => {
			// FIXME ganz mieser Hack:
			window['app'].article.version = article.version;
			self.setState({
				article,
			});
		});
	}

	private nextFeedbackStep() {
		const items : FeedbackItem[] = this.articleElements
			.map((element : ArticleElement) => element.getCurrentData())
			.filter((item : FeedbackItem) => item !== null);  // TODO fix with "isEdited" or similar

		if (items.length <= 0) {
			alert('The feedback is still empty, nothing was sent');
			return;
		}

		this.setState({
			isFeedbackReady: true,
			articleItems: items,
		});
	}

	public render() {
		return this.state.isFeedbackReady
			? this.renderConfirmationPage()
			: this.renderFeedbackForm();
	}

	private renderFeedbackForm() {
		// Initial state has no article data, render empty
		if (this.state.article === null) {
			return null;
		}

		const refFn = (i : any) => { this.articleElements.push(i); };
		const sendFn = () => this.nextFeedbackStep.call(this);

		// Iterate article elements and render sub components
		return (
			<section id="content">
				{ this.state.article.items.map(item => createArticleElement(item, refFn)) }
				<FinishButton SendForm={sendFn} />
			</section>
		);
	}

	private renderConfirmationPage() {
		return (
			<div className="confirmation">
				<div className="container">
					<div className="row section frontpage">
						<div className="content u-full-width">
							<PostFeedbackContainer
								articleUrl={this.state.article && this.state.article.url?this.state.article.url.href:null}
								articleItems={this.state.articleItems}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

}
